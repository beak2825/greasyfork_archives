// ==UserScript==
// @name         iChicomi Manga Downloader
// @namespace    ichicomi-downloader
// @version      1.0
// @description  Descarga y reordena (4x4) las imágenes desde ichicomi.com
// @author       Tu nombre
// @license      MIT
// @match        https://ichicomi.com/episode/*
// @require      https://cdn.jsdelivr.net/npm/jszip@3/dist/jszip.min.js
// @require      https://cdn.jsdelivr.net/npm/file-saver@2/dist/FileSaver.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555170/iChicomi%20Manga%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/555170/iChicomi%20Manga%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Función para reordenar imagen 4x4
    async function unscramble4x4(blob) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const url = URL.createObjectURL(blob);
            
            img.onload = () => {
                const w = img.width;
                const h = img.height;
                const canvas = document.createElement('canvas');
                canvas.width = w;
                canvas.height = h;
                const ctx = canvas.getContext('2d');
                
                const tileW = Math.floor(w / 4);
                const tileH = Math.floor(h / 4);
                
                // Orden de reordenamiento 4x4
                const order = [
                    15, 10, 5, 0,
                    14, 11, 6, 1,
                    13, 8, 7, 2,
                    12, 9, 4, 3
                ];
                
                for (let i = 0; i < 16; i++) {
                    const srcIdx = order[i];
                    const srcX = (srcIdx % 4) * tileW;
                    const srcY = Math.floor(srcIdx / 4) * tileH;
                    const destX = (i % 4) * tileW;
                    const destY = Math.floor(i / 4) * tileH;
                    
                    ctx.drawImage(img, srcX, srcY, tileW, tileH, destX, destY, tileW, tileH);
                }
                
                URL.revokeObjectURL(url);
                canvas.toBlob(resolve, 'image/jpeg', 0.95);
            };
            
            img.onerror = () => {
                URL.revokeObjectURL(url);
                reject(new Error('Error al cargar la imagen'));
            };
            
            img.src = url;
        });
    }

    // Crear botón de descarga
    const downloadBtn = document.createElement('button');
    downloadBtn.textContent = '📥 Descargar Capítulo';
    downloadBtn.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        z-index: 9999;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: #fff;
        padding: 12px 20px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        font-size: 14px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        transition: all 0.3s ease;
    `;
    document.body.appendChild(downloadBtn);

    downloadBtn.addEventListener('mouseenter', () => {
        downloadBtn.style.transform = 'translateY(-2px)';
        downloadBtn.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.4)';
    });

    downloadBtn.addEventListener('mouseleave', () => {
        downloadBtn.style.transform = 'translateY(0)';
        downloadBtn.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
    });

    downloadBtn.addEventListener('click', async () => {
        downloadBtn.disabled = true;
        downloadBtn.textContent = '⏳ Descargando...';
        
        try {
            // Buscar el JSON en la página
            const jsonEl = document.querySelector('#episode-json');
            if (!jsonEl) {
                alert('❌ No se encontró #episode-json. Verifica que estés en una página de capítulo.');
                resetButton();
                return;
            }

            let epData;
            try {
                epData = JSON.parse(jsonEl.dataset.value);
            } catch (e) {
                alert('❌ Error al leer los datos del capítulo.');
                console.error(e);
                resetButton();
                return;
            }

            // Extraer páginas
            const pages = epData?.readableProduct?.pageStructure?.pages || [];
            const mainPages = pages.filter(p => p.type === 'main');
            
            if (!mainPages.length) {
                alert('❌ No se encontraron páginas para descargar.');
                resetButton();
                return;
            }

            // Crear ZIP
            const zip = new JSZip();
            
            for (let i = 0; i < mainPages.length; i++) {
                const page = mainPages[i];
                const imgUrl = page.src;
                const idx = i + 1;
                
                downloadBtn.textContent = `⏳ Descargando ${idx}/${mainPages.length}...`;
                console.log(`Descargando página ${idx}: ${imgUrl}`);

                const resp = await fetch(imgUrl);
                const blob = await resp.blob();

                let finalBlob = blob;
                if (!imgUrl.includes('/original/')) {
                    try {
                        finalBlob = await unscramble4x4(blob);
                        console.log(`✅ Página ${idx} desencriptada (4x4)`);
                    } catch (err) {
                        console.warn(`⚠️ No se pudo desencriptar la página ${idx}:`, err);
                    }
                }

                const fileName = String(idx).padStart(3, '0') + '.jpg';
                zip.file(fileName, finalBlob);
            }

            downloadBtn.textContent = '📦 Generando ZIP...';
            const zipContent = await zip.generateAsync({ type: 'blob' });
            
            const chapterTitle = epData?.readableProduct?.title || 'capitulo';
            const fileName = `ichicomi_${chapterTitle.replace(/[^a-z0-9]/gi, '_')}.zip`;
            
            saveAs(zipContent, fileName);
            alert(`✅ Descarga completa: ${mainPages.length} páginas`);
            
        } catch (error) {
            console.error('❌ Error en la descarga:', error);
            alert('❌ Ocurrió un error. Revisa la consola para más detalles.');
        }
        
        resetButton();
    });

    function resetButton() {
        downloadBtn.disabled = false;
        downloadBtn.textContent = '📥 Descargar Capítulo';
    }

})();
