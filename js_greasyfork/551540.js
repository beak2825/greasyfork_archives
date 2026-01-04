// ==UserScript==
// @name         M3U8 Downloader Helper
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Encontra URLs de M3U8 na página e gera um comando de download para o ffmpeg.
// @author       Você
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @run-at       document-idle
 // @license MIT
// @downloadURL https://update.greasyfork.org/scripts/551540/M3U8%20Downloader%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/551540/M3U8%20Downloader%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- ESTILOS PARA A INTERFACE ---
    GM_addStyle(`
        #m3u8-finder-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            padding: 10px 15px;
            font-size: 14px;
            cursor: pointer;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
        #m3u8-finder-btn:hover {
            background-color: #0056b3;
        }
        #m3u8-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 10000;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        #m3u8-modal-content {
            background: #fff;
            padding: 20px;
            border-radius: 8px;
            width: 80%;
            max-width: 600px;
            max-height: 80vh;
            overflow-y: auto;
            color: #333;
        }
        #m3u8-modal-content h2 {
            margin-top: 0;
            color: #007bff;
        }
        #m3u8-modal-content .m3u8-item {
            margin-bottom: 15px;
            border: 1px solid #ddd;
            padding: 10px;
            border-radius: 4px;
        }
        #m3u8-modal-content .m3u8-command {
            background-color: #f5f5f5;
            padding: 10px;
            border-radius: 4px;
            font-family: monospace;
            white-space: pre-wrap;
            word-wrap: break-word;
            font-size: 12px;
            margin-bottom: 10px;
        }
        #m3u8-modal-content button.copy-btn {
            background-color: #28a745;
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 4px;
            cursor: pointer;
            margin-right: 10px;
        }
        #m3u8-modal-content button.copy-btn:hover {
            background-color: #218838;
        }
        #m3u8-modal-content button.close-btn {
            background-color: #dc3545;
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 4px;
            cursor: pointer;
        }
    `);

    // --- LÓGICA DO SCRIPT ---

    // Função para encontrar URLs M3U8 na página
    function findM3u8Urls() {
        const urls = new Set();
        // 1. Procurar em tags <video> e <source>
        document.querySelectorAll('video, source').forEach(el => {
            if (el.src && el.src.includes('.m3u8')) {
                urls.add(el.src);
            }
        });

        // 2. Procurar em scripts (uma abordagem simples)
        // Isso pode encontrar URLs que são carregadas dinamicamente
        const scripts = document.querySelectorAll('script');
        const m3u8Regex = /https?:\/\/[^\s"'`]+\.m3u8[^\s"'`]*/g;
        scripts.forEach(script => {
            const matches = script.innerHTML.match(m3u8Regex);
            if (matches) {
                matches.forEach(url => urls.add(url));
            }
        });

        return Array.from(urls);
    }

    // Função para criar e exibir o painel com os resultados
    function showResultsModal(urls) {
        // Remove painel antigo se existir
        const oldOverlay = document.getElementById('m3u8-modal-overlay');
        if (oldOverlay) {
            oldOverlay.remove();
        }

        if (urls.length === 0) {
            alert('Nenhum link .m3u8 encontrado nesta página.');
            return;
        }

        const overlay = document.createElement('div');
        overlay.id = 'm3u8-modal-overlay';

        const content = document.createElement('div');
        content.id = 'm3u8-modal-content';

        let html = '<h2>Links M3U8 Encontrados:</h2>';
        html += '<p>Copie o comando e cole no seu terminal (com FFmpeg instalado).</p>';

        urls.forEach((url, index) => {
            const command = `ffmpeg -i "${url}" -c copy "video_${index + 1}.mp4"`;
            html += `
                <div class="m3u8-item">
                    <p><strong>URL:</strong> ${url}</p>
                    <div class="m3u8-command" id="command-${index}">${command}</div>
                    <button class="copy-btn" data-command-id="${index}">Copiar Comando</button>
                </div>
            `;
        });

        html += '<button class="close-btn">Fechar</button>';
        content.innerHTML = html;

        overlay.appendChild(content);
        document.body.appendChild(overlay);

        // Adicionar eventos aos botões
        content.querySelector('.close-btn').addEventListener('click', () => {
            overlay.remove();
        });

        content.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const commandId = e.target.getAttribute('data-command-id');
                const commandText = document.getElementById(`command-${commandId}`).textContent;
                GM_setClipboard(commandText, 'text');
                e.target.textContent = 'Copiado!';
                setTimeout(() => {
                    e.target.textContent = 'Copiar Comando';
                }, 2000);
            });
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });
    }

    // Cria o botão principal na página
    function createMainButton() {
        const button = document.createElement('button');
        button.id = 'm3u8-finder-btn';
        button.textContent = '⇩ Encontrar Vídeos M3U8';
        button.addEventListener('click', () => {
            const urls = findM3u8Urls();
            showResultsModal(urls);
        });
        document.body.appendChild(button);
    }

    // Inicia o script
    createMainButton();

})();
