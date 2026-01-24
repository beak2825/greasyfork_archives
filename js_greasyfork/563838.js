// ==UserScript==
// @name         Google Drive Direct Download, Auto-Click & Close
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Redirects, downloads automatically and closes the tab.
// @author       biribiritt
// @license      MIT License
// @match        https://drive.google.com/file/*/view*
// @match        https://drive.usercontent.google.com/download*
// @grant        window.close
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/563838/Google%20Drive%20Direct%20Download%2C%20Auto-Click%20%20Close.user.js
// @updateURL https://update.greasyfork.org/scripts/563838/Google%20Drive%20Direct%20Download%2C%20Auto-Click%20%20Close.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const currentUrl = window.location.href;

    // --- PARTE 1: REDIRECIONAMENTO ---
    if (currentUrl.includes('drive.google.com/file/') && currentUrl.includes('/view')) {

        console.log('[G-Drive Direct] Redirecionando para o link direto...');

        const idMatch = currentUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);

        if (idMatch && idMatch[1]) {
            const fileId = idMatch[1];
            // URL de download direto
            const downloadUrl = `https://drive.usercontent.google.com/download?id=${fileId}&export=download&authuser=0`;

            // Redireciona na mesma aba
            window.location.replace(downloadUrl);
        }
    }

    // --- PARTE 2: AUTO-CLIQUE E FECHAR ABA ---
    if (currentUrl.includes('drive.usercontent.google.com/download')) {

        const attemptAutoDownload = setInterval(() => {

            const downloadForm = document.getElementById('download-form');

            if (downloadForm) {
                console.log('[G-Drive Direct] Formulário encontrado. Iniciando download...');
                clearInterval(attemptAutoDownload);

                // 1. Submete o formulário para iniciar o download
                downloadForm.submit();

                // 2. Aguarda 1 segundo (1000ms) para garantir que o pedido de download partiu
                setTimeout(() => {
                    console.log('[G-Drive Direct] Tentando fechar a aba...');
                    // 3. Solicita o fechamento da aba/janela
                    window.close();
                }, 3000);
            }

        }, 100);

        // Timeout de segurança: para de procurar após 5 segundos
        setTimeout(() => {
            clearInterval(attemptAutoDownload);
        }, 5000);
    }
})();

/* 
MIT License

Copyright (c) 2024 biribiritt

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/