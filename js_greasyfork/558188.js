// ==UserScript==
// @name         Identi Bypass JDownloader Click'n'Load 2
// @namespace    https://identi.io/
// @version      1.0
// @description  Desencripta los enlaces Click'n'Load 2 directamente en el navegador sin tener JDownloader abierto.
// @author       Legend
// @license      MIT
// @match        *://identi.io/*
// @match        *://www.identi.io/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558188/Identi%20Bypass%20JDownloader%20Click%27n%27Load%202.user.js
// @updateURL https://update.greasyfork.org/scripts/558188/Identi%20Bypass%20JDownloader%20Click%27n%27Load%202.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /* global CryptoJS */

    // --- 0. Inyectar CSS (Extraído de tus archivos para asegurar el estilo exacto) ---
    const style = document.createElement('style');
    style.innerHTML = `
        /* Contenedor Principal (El recuadro azul claro con sombra) */
        .perfect_spoiler_cont {
            background: #E4F1FB !important; /* Fondo azul claro */
            padding: 15px;
            border-radius: 10px;
            box-shadow: 0 1px 0 #fff, 0 1px 2px rgba(0,0,0,.25) inset !important; /* El efecto de profundidad */
            width: 90%;
            max-width: 600px;
            margin: 15px auto;
            text-align: center;
            border: 1px solid #C3D0D9;
        }

        /* Botón Verde (Estilo nativo UI Positive) */
        .perfect_btn {
            background: #2ecc71 !important; /* Verde base */
            border: none !important;
            color: #fff !important;
            font-weight: bold;
            padding: 8px 12px !important;
            font-size: 14px !important;
            border-radius: 3px;
            cursor: pointer;
            text-shadow: 0 1px 0 rgba(0,0,0,0.1);
            display: inline-block;
            margin-bottom: 15px; /* Separación con la caja de abajo */
        }
        .perfect_btn:hover {
            background: #27ae60 !important; /* Verde más oscuro al pasar mouse */
        }

        /* Caja de enlaces (Borde punteado azul) */
        .perfect_info_bbc {
            background: #fff !important; /* Fondo blanco puro */
            border: 1px dashed #3190D3 !important; /* Borde azul punteado */
            color: #3190D3 !important;
            padding: 10px;
            border-radius: 4px;
            text-align: center;
            box-shadow: 0 0 3px #DDD inset;
            word-wrap: break-word;
            display: none; /* Oculto al inicio */
        }

        /* Links */
        .perfect_link {
            display: block;
            color: #096FDB !important;
            text-decoration: none;
            font-size: 14px !important;
            margin-bottom: 4px;
            padding-bottom: 4px;
        }
        .perfect_link:last-child { border-bottom: none; }
        .perfect_link:hover { text-decoration: underline; color: #D85724 !important; }
    `;
    document.head.appendChild(style);


    // --- 1. Lógica de Desencriptado ---
    function decryptCNL2(crypted, jk) {
        try {
            const keyHexMatch = jk.match(/'([0-9a-fA-F]+)'/);
            if (!keyHexMatch) return null;
            const keyHex = keyHexMatch[1];
            const key = CryptoJS.enc.Hex.parse(keyHex);
            const iv = key;

            const decrypted = CryptoJS.AES.decrypt(crypted, key, {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.NoPadding
            });

            let plainText = decrypted.toString(CryptoJS.enc.Utf8);
            plainText = plainText.replace(/\0/g, '');
            plainText = plainText.replace(/<br\s*\/?>/gi, '\n');

            const linksArray = plainText.split('\n')
                .map(line => line.trim())
                .filter(line => line.length > 0);

            return linksArray;
        } catch (e) {
            console.error(e);
            return ["Error al desencriptar"];
        }
    }

    // --- 2. Crear la Interfaz (UI) ---
    function createRealSpoilerUI(form) {
        // 1. Crear el contenedor azul claro (.spoiler_cont)
        const container = document.createElement('div');
        container.className = 'perfect_spoiler_cont';

        // 2. Crear el botón verde
        const btn = document.createElement('input');
        btn.type = 'button';
        btn.value = 'Ver Links de Descarga';
        btn.className = 'perfect_btn';

        // 3. Crear la caja blanca punteada (.info_bbc)
        const contentBox = document.createElement('div');
        contentBox.className = 'perfect_info_bbc';

        // Armar la estructura
        container.appendChild(btn);
        container.appendChild(contentBox);

        // Insertar después del formulario original
        form.parentNode.appendChild(container);

        // --- Evento Click ---
        btn.addEventListener('click', (e) => {
            e.preventDefault();

            // Toggle (Mostrar/Ocultar)
            if (contentBox.style.display === 'block') {
                contentBox.style.display = 'none';
                return;
            }

            // Si está vacío, desencriptar
            if (contentBox.innerHTML === '') {
                const cryptedInput = form.querySelector('input[name="crypted"]');
                const jkInput = form.querySelector('input[name="jk"]');

                if (cryptedInput && jkInput) {
                    const links = decryptCNL2(cryptedInput.value, jkInput.value);

                    if (links && links.length > 0) {
                        const htmlContent = links.map(link => {
                            if (link.startsWith('http')) {
                                return `<a href="${link}" target="_blank" class="perfect_link">${link}</a>`;
                            }
                            return `<span class="perfect_link">${link}</span>`;
                        }).join('');

                        contentBox.innerHTML = htmlContent;
                    } else {
                        contentBox.innerHTML = "No se encontraron enlaces válidos.";
                    }
                }
            }

            // Mostrar
            contentBox.style.display = 'block';
        });
    }

    // --- Ejecución ---
    const forms = document.querySelectorAll('form[action*="addcrypted2"]');
    forms.forEach(form => {
        if (form.getAttribute('data-bypassed') === 'true') return;
        form.setAttribute('data-bypassed', 'true');
        createRealSpoilerUI(form);
    });

})();