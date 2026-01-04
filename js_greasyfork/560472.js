// ==UserScript==
// @name         Favicon Fetcher & Base64 Encoder
// @name:zh-CN   网站Favicon获取器与Base64编码器
// @name:zh-TW   網站Favicon擷取器與Base64編碼器
// @name:es      Obtenedor y Codificador Base64 de Favicon
// @name:fr      Récupérateur et Encodeur Base64 de Favicon
// @name:de      Favicon-Abruf und Base64-Encoder
// @name:ja      Favicon取得＆Base64エンコーダー
// @name:ko      파비콘 가져오기 & Base64 인코더
// @name:ru      Получатель Favicon и кодировщик Base64
// @name:pt      Obtenedor e Codificador Base64 de Favicon
// @name:it      Recuperatore e Codificatore Base64 di Favicon
// @name:ar      جلب أيقونة الموقع ومشفّر Base64
// @name:hi      फ़ेविकॉन फेचर और Base64 एनकोडर
// @name:pl      Pobieracz Favicon i Koder Base64
// @name:nl      Favicon Ophaaltool & Base64 Encoder
// @name:tr      Favicon Çekici ve Base64 Kodlayıcı
// @description  Fetch site favicon, show it in new tab, and copy base64 to clipboard
// @description:zh-CN 获取网站Favicon，在新标签页中显示，并将Base64复制到剪贴板
// @description:zh-TW 擷取網站Favicon，在新分頁顯示，並將Base64複製到剪貼簿
// @description:es  Obtiene el favicon del sitio, lo muestra en una nueva pestaña y copia el base64 al portapapeles
// @description:fr  Récupère le favicon du site, l'affiche dans un nouvel onglet et copie le base64 dans le presse-papiers
// @description:de  Ruft das Favicon der Website ab, zeigt es in einem neuen Tab an und kopiert den Base64-Code in die Zwischenablage
// @description:ja  サイトのファビコンを取得し、新規タブで表示、Base64をクリップボードにコピー
// @description:ko  사이트 파비콘을 가져와 새 탭에 표시하고 Base64를 클립보드에 복사
// @description:ru  Получает favicon сайта, показывает его в новой вкладке и копирует base64 в буфер обмена
// @description:pt  Obtém o favicon do site, exibe em nova aba e copia o base64 para a área de transferência
// @description:it  Recupera la favicon del sito, la mostra in una nuova scheda e copia il base64 negli appunti
// @description:ar  يجلب أيقونة الموقع، يعرضها في علامة تبويب جديدة، وينسخ الـBase64 إلى الحافظة
// @description:hi  साइट का फ़ेविकॉन प्राप्त करें, नए टैब में दिखाएँ, और Base64 को क्लिपबोर्ड पर कॉपी करें
// @description:pl  Pobiera favicon strony, wyświetla go w nowej karcie i kopiuje base64 do schowka
// @description:nl  Haalt de favicon van de site op, toont deze in een nieuw tabblad en kopieert de base64 naar het klembord
// @description:tr  Site favicon'unu alır, yeni sekmede gösterir ve base64'ü panoya kopyalar
// @namespace    http://tampermonkey.net/
// @version      1.2
// @author       aspen138
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @connect      folge.me
// @connect      *
// @run-at       document-start
// @license      MIT
// @icon   data:image/svg+xml;base64,PHN2ZyBpZD0iaWNvbi11bmlGMzAyIiB2aWV3Qm94PSIwIDAgMzYgMzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+DQo8cGF0aCBkPSJNMzAgNWgtMjBjLTAuNTYzIDAtMSAwLjQzOC0xIDF2MTZjMCAwLjU2MyAwLjQzOCAxIDEgMWgyMGMwLjU2MyAwIDEtMC40MzggMS0xdi0xNmMwLTAuNTYzLTAuNDM4LTEtMS0xek0xMCAyaDIwYzIuMTg4IDAgNCAxLjgxMyA0IDR2MTZjMCAyLjE4OC0xLjgxMyA0LTQgNGgtMjBjLTIuMTg4IDAtNC0xLjgxMy00LTR2LTE2YzAtMi4xODggMS44MTMtNCA0LTR6TTE1IDljMCAxLjEyNS0wLjg3NSAyLTIgMnMtMi0wLjg3NS0yLTIgMC44NzUtMiAyLTIgMiAwLjg3NSAyIDJ6TTIzLjgxMyA5LjI1bDUgOC41YzAuMjUgMC40MzggMC4yNSAxIDAgMS41LTAuMjUgMC40MzgtMC43NSAwLjc1LTEuMzEzIDAuNzVoLTE1Yy0wLjU2MyAwLTEuMDYzLTAuMzEzLTEuMzEzLTAuODEzLTAuMzEzLTAuNS0wLjI1LTEuMDYzIDAuMDYzLTEuNTYzbDMuNS01YzAuMzEzLTAuMzc1IDAuNzUtMC42MjUgMS4yNS0wLjYyNXMwLjkzOCAwLjI1IDEuMjUgMC42MjVsMS4wNjMgMS41NjMgMi44NzUtNC45MzhjMC4zMTMtMC40MzggMC44MTMtMC43NSAxLjMxMy0wLjc1IDAuNTYzIDAgMSAwLjMxMyAxLjMxMyAwLjc1ek0zIDkuNXYxOC41YzAgMC41NjMgMC40MzggMSAxIDFoMjIuNWMwLjgxMyAwIDEuNSAwLjY4OCAxLjUgMS41cy0wLjY4OCAxLjUtMS41IDEuNWgtMjIuNWMtMi4xODggMC00LTEuODEzLTQtNHYtMTguNWMwLTAuODEzIDAuNjg4LTEuNSAxLjUtMS41czEuNSAwLjY4OCAxLjUgMS41eiI+PC9wYXRoPg0KPC9zdmc+
// @downloadURL https://update.greasyfork.org/scripts/560472/Favicon%20Fetcher%20%20Base64%20Encoder.user.js
// @updateURL https://update.greasyfork.org/scripts/560472/Favicon%20Fetcher%20%20Base64%20Encoder.meta.js
// ==/UserScript==


(function() {
    'use strict';

    GM_registerMenuCommand('📋 Get Favicon Base64', async function() {
        try {
            const currentUrl = encodeURIComponent(window.location.href);
            const apiUrl = `https://folge.me/tools/api/favicon?url=${currentUrl}`;

            // Fetch favicon info from API
            GM_xmlhttpRequest({
                method: 'GET',
                url: apiUrl,
                onload: async function(response) {
                    try {
                        const data = JSON.parse(response.responseText);

                        if (data.icons && data.icons.length > 0) {
                            // Get the first icon URL
                            const faviconUrl = data.icons[0].href;

                            // Fetch the favicon image and convert to base64
                            GM_xmlhttpRequest({
                                method: 'GET',
                                url: faviconUrl,
                                responseType: 'blob',
                                onload: function(imgResponse) {
                                    const reader = new FileReader();
                                    reader.onloadend = function() {
                                        const base64 = reader.result;

                                        // Copy base64 to clipboard
                                        GM_setClipboard(base64, 'text');

                                        // Create HTML content for new tab
                                        const htmlContent = `
                                            <!DOCTYPE html>
                                            <html>
                                            <head>
                                                <meta charset="UTF-8">
                                                <title>Favicon - ${data.host}</title>
                                                <style>
                                                    body {
                                                        font-family: Arial, sans-serif;
                                                        max-width: 800px;
                                                        margin: 50px auto;
                                                        padding: 20px;
                                                        background: #f5f5f5;
                                                    }
                                                    .container {
                                                        background: white;
                                                        padding: 30px;
                                                        border-radius: 8px;
                                                        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                                                    }
                                                    h1 {
                                                        color: #333;
                                                        margin-bottom: 20px;
                                                    }
                                                    .favicon-display {
                                                        text-align: center;
                                                        margin: 30px 0;
                                                    }
                                                    .favicon-display img {
                                                        max-width: 200px;
                                                        border: 1px solid #ddd;
                                                        padding: 10px;
                                                        background: white;
                                                    }
                                                    .info {
                                                        background: #f9f9f9;
                                                        padding: 15px;
                                                        border-radius: 4px;
                                                        margin: 20px 0;
                                                    }
                                                    .success {
                                                        color: #28a745;
                                                        font-weight: bold;
                                                        padding: 10px;
                                                        background: #d4edda;
                                                        border-radius: 4px;
                                                        margin-bottom: 20px;
                                                    }
                                                    .base64-box {
                                                        background: #f4f4f4;
                                                        padding: 15px;
                                                        border-radius: 4px;
                                                        word-break: break-all;
                                                        font-family: monospace;
                                                        font-size: 12px;
                                                        max-height: 200px;
                                                        overflow-y: auto;
                                                        border: 1px solid #ddd;
                                                    }
                                                    button {
                                                        background: #007bff;
                                                        color: white;
                                                        border: none;
                                                        padding: 10px 20px;
                                                        border-radius: 4px;
                                                        cursor: pointer;
                                                        margin-top: 10px;
                                                    }
                                                    button:hover {
                                                        background: #0056b3;
                                                    }
                                                </style>
                                            </head>
                                            <body>
                                                <div class="container">
                                                    <h1>&#127912; Favicon Details</h1>
                                                    <div class="success">&#9989; Base64 copied to clipboard!</div>

                                                    <div class="info">
                                                        <strong>Host:</strong> ${data.host}<br>
                                                        <strong>Source URL:</strong> ${data.url}<br>
                                                        <strong>Favicon URL:</strong> ${faviconUrl}<br>
                                                        <strong>Size:</strong> ${data.icons[0].sizes}
                                                    </div>

                                                    <div class="favicon-display">
                                                        <h3>Favicon Preview:</h3>
                                                        <img src="${base64}" alt="Favicon">
                                                    </div>

                                                    <h3>Base64 Encoded Data:</h3>
                                                    <div class="base64-box" id="base64Box">${base64}</div>
                                                    <button onclick="copyAgain()">&#128203; Copy Again</button>

                                                    <script>
                                                        function copyAgain() {
                                                            const text = document.getElementById('base64Box').textContent;
                                                            navigator.clipboard.writeText(text).then(() => {
                                                                alert('\u2705 Copied to clipboard!');
                                                            });
                                                        }
                                                    </script>
                                                </div>
                                            </body>
                                            </html>
                                        `;

                                        // Open in new tab
                                        const blob = new Blob([htmlContent], {type: 'text/html'});
                                        const url = URL.createObjectURL(blob);
                                        GM_openInTab(url, {active: true});
                                    };
                                    reader.readAsDataURL(imgResponse.response);
                                },
                                onerror: function(err) {
                                    alert('\u274C Failed to fetch favicon image');
                                    console.error(err);
                                }
                            });
                        } else {
                            alert('\u274C No favicon found for this site');
                        }
                    } catch (e) {
                        alert('\u274C Failed to parse API response');
                        console.error(e);
                    }
                },
                onerror: function(err) {
                    alert('\u274C Failed to fetch favicon data from API');
                    console.error(err);
                }
            });
        } catch (error) {
            alert('\u274C An error occurred: ' + error.message);
            console.error(error);
        }
    });
})();