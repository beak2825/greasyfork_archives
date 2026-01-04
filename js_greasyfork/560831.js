// ==UserScript==
// @name         Burlington Book PDF Generator
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Genera PDF de libros de Burlington English
// @author       You
// @match        https://*.burlingtonenglish.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=burlingtonenglish.com
// @grant        none
// @license      iron web10 2025
// @downloadURL https://update.greasyfork.org/scripts/560831/Burlington%20Book%20PDF%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/560831/Burlington%20Book%20PDF%20Generator.meta.js
// ==/UserScript==

(function() {
    'use strict';


    const createButton = () => {
        const button = document.createElement('div');
        button.id = 'pdf-generator-btn';
        button.innerHTML = `
            <div style="
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
                color: white;
                padding: 15px 25px;
                border-radius: 50px;
                cursor: pointer;
                box-shadow: 0 4px 15px rgba(0,0,0,0.3);
                font-family: Arial, sans-serif;
                font-weight: bold;
                font-size: 16px;
                z-index: 99999;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 10px;
            " onmouseover="this.style.transform='scale(1.05)'; this.style.boxShadow='0 6px 20px rgba(0,0,0,0.4)'"
               onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 4px 15px rgba(0,0,0,0.3)'">
                📚 Generar PDF
            </div>
        `;
        document.body.appendChild(button);
        return button;
    };


    const createProgressPanel = () => {
        const panel = document.createElement('div');
        panel.id = 'pdf-progress-panel';
        panel.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                padding: 30px;
                border-radius: 15px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.3);
                z-index: 100000;
                min-width: 400px;
                font-family: Arial, sans-serif;
            ">
                <h2 style="margin: 0 0 20px 0; color: #333;">📚 Generando PDF</h2>
                <div id="progress-text" style="margin-bottom: 15px; color: #666;"></div>
                <div style="
                    width: 100%;
                    height: 20px;
                    background: #e0e0e0;
                    border-radius: 10px;
                    overflow: hidden;
                ">
                    <div id="progress-bar" style="
                        width: 0%;
                        height: 100%;
                        background: linear-gradient(90deg, #FF6B35 0%, #F7931E 100%);
                        transition: width 0.3s ease;
                    "></div>
                </div>
                <div id="progress-log" style="
                    margin-top: 15px;
                    max-height: 200px;
                    overflow-y: auto;
                    font-size: 12px;
                    color: #888;
                    background: #f5f5f5;
                    padding: 10px;
                    border-radius: 5px;
                "></div>
            </div>
        `;
        document.body.appendChild(panel);
        return panel;
    };


    const updateProgress = (text, percent, log = null) => {
        const progressText = document.getElementById('progress-text');
        const progressBar = document.getElementById('progress-bar');
        const progressLog = document.getElementById('progress-log');

        if (progressText) progressText.textContent = text;
        if (progressBar) progressBar.style.width = percent + '%';
        if (log && progressLog) {
            progressLog.innerHTML += log + '<br>';
            progressLog.scrollTop = progressLog.scrollHeight;
        }
    };


    const generatePDF = async () => {
        const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));


        const progressPanel = createProgressPanel();
        updateProgress('Iniciando...', 0, '🚀 Comenzando generación de PDF');

        const selector = document.querySelector('select.MuiNativeSelect-select');

        if (!selector) {
            alert('❌ No se encontró el selector de páginas. Asegúrate de estar en la página del libro.');
            progressPanel.remove();
            return;
        }

        const options = Array.from(selector.options);
        const totalPages = options.length;

        updateProgress(`Detectadas ${totalPages} páginas`, 5, `📖 ${totalPages} páginas encontradas`);

        const images = [];
        const imageUrls = new Set();

        const getBookPrefix = () => {
            const container = document.querySelector('[class*="book-"][class*="-page-"]');
            if (container) {
                const match = container.className.match(/(book-[a-f0-9-]+-page-)/);
                return match ? match[1] : null;
            }
            return null;
        };

        const getImageForPage = (pageNum) => {
            const prefix = getBookPrefix();
            if (!prefix) return null;

            const selector = `.${prefix}${pageNum}`;
            const container = document.querySelector(selector);

            if (container) {
                const img = container.querySelector('img[src*="cdn.burlingtonenglish.com"]');
                return img?.src || null;
            }
            return null;
        };

        const waitForPageContainer = async (pageNum, maxAttempts = 30) => {
            const prefix = getBookPrefix();
            if (!prefix) return false;

            for (let i = 0; i < maxAttempts; i++) {
                await wait(200);
                const selector = `.${prefix}${pageNum}`;
                const container = document.querySelector(selector);

                if (container) {
                    await wait(300);
                    const img = container.querySelector('img[src*="cdn.burlingtonenglish.com"]');
                    if (img?.src) {
                        return true;
                    }
                }
            }
            return false;
        };


        for (let i = 0; i < totalPages; i++) {
            const option = options[i];
            const pageValue = option.value;
            const pageName = option.textContent.trim();
            const pageNum = i + 1;
            const progress = Math.round(((i + 1) / totalPages) * 50);

            updateProgress(`Capturando página ${pageNum}/${totalPages}: ${pageName}`, progress);

            selector.value = pageValue;
            selector.dispatchEvent(new Event('change', { bubbles: true }));

            const exists = await waitForPageContainer(pageNum);

            if (!exists) {
                updateProgress(`Capturando página ${pageNum}/${totalPages}`, progress, `⚠️ No se encontró página ${pageNum}`);
                continue;
            }

            const imgUrl = getImageForPage(pageNum);

            if (!imgUrl) {
                updateProgress(`Capturando página ${pageNum}/${totalPages}`, progress, `⚠️ Sin imagen en página ${pageNum}`);
                continue;
            }

            const isDuplicate = imageUrls.has(imgUrl);

            imageUrls.add(imgUrl);
            images.push({
                pageNum: pageNum,
                name: pageName,
                url: imgUrl,
                id: imgUrl.split('/').pop().split('_')[0]
            });

            const logMsg = isDuplicate ?
                `⚠️ Pág ${pageNum}: ${pageName} (repetida)` :
                `✓ Pág ${pageNum}: ${pageName}`;
            updateProgress(`Capturando página ${pageNum}/${totalPages}`, progress, logMsg);
        }

        updateProgress(`Capturadas ${images.length} páginas`, 50, `✅ ${images.length} páginas capturadas`);


        updateProgress('Descargando imágenes...', 55, '📥 Iniciando descarga de imágenes');

        const imageBlobs = new Array(images.length);
        const batchSize = 10;

        for (let i = 0; i < images.length; i += batchSize) {
            const end = Math.min(i + batchSize, images.length);
            const batch = images.slice(i, end);
            const progress = 55 + Math.round(((i + batchSize) / images.length) * 30);

            await Promise.all(batch.map(async (page, batchIdx) => {
                const idx = i + batchIdx;
                try {
                    const res = await fetch(page.url);
                    imageBlobs[idx] = await res.blob();
                    updateProgress(`Descargando ${idx + 1}/${images.length}`, progress, `✓ ${idx + 1}/${images.length} - ${page.id}`);
                } catch (e) {
                    imageBlobs[idx] = null;
                    updateProgress(`Descargando ${idx + 1}/${images.length}`, progress, `✗ Error ${idx + 1}: ${e.message}`);
                }
            }));
        }

        updateProgress('Generando PDF...', 85, '📄 Creando documento PDF');


        if (typeof window.jspdf === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
            document.head.appendChild(script);
            await new Promise(resolve => script.onload = resolve);
            updateProgress('Generando PDF...', 87, '✓ Librería jsPDF cargada');
        }

        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'px',
            format: [815, 1253.54],
            compress: true
        });

        let pdfPages = 0;

        for (let i = 0; i < imageBlobs.length; i++) {
            if (!imageBlobs[i]) continue;

            const imgData = await new Promise(resolve => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(imageBlobs[i]);
            });

            if (pdfPages > 0) pdf.addPage();
            pdf.addImage(imgData, 'JPEG', 0, 0, 815, 1253.54);
            pdfPages++;

            const progress = 87 + Math.round((pdfPages / imageBlobs.length) * 10);
            if (pdfPages % 5 === 0) {
                updateProgress(`Agregando páginas al PDF (${pdfPages}/${imageBlobs.length})`, progress);
            }
        }

        const now = new Date();
        const fecha = now.toISOString().slice(0, 10);
        const hora = now.toTimeString().slice(0, 8).replace(/:/g, '-');
        const nombre = `libro_${images.length}pag_${fecha}_${hora}.pdf`;

        updateProgress('Guardando PDF...', 98, `💾 Guardando ${nombre}`);
        pdf.save(nombre);

        updateProgress('¡Completado!', 100, `🎉 PDF generado exitosamente: ${nombre}`);

   
        setTimeout(() => {
            progressPanel.remove();
        }, 3000);
    };

 
    const init = () => {
       
        const checkInterval = setInterval(() => {
            const selector = document.querySelector('select.MuiNativeSelect-select');
            if (selector) {
                clearInterval(checkInterval);

           
                const button = createButton();

                button.addEventListener('click', () => {
                    generatePDF();
                });
            }
        }, 1000);

       
        setTimeout(() => clearInterval(checkInterval), 10000);
    };

   
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();