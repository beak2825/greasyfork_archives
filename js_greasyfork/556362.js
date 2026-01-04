// ==UserScript==
// @name         EDC Invoice OCR
// @namespace    lychanraksmey.eu.org
// @version      2.1
// @description  Extract INV/ number and Amount from Flutter Canvas on EDC.com.kh portal
// @author       LCR
// @match        https://portal.edc.com.kh/public/invoice/*
// @grant        GM_setClipboard
// @require      https://cdn.jsdelivr.net/npm/tesseract.js@5.0.4/dist/tesseract.min.js
// @require      https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=edc.com.kh
 // @license     MIT 
// @downloadURL https://update.greasyfork.org/scripts/556362/EDC%20Invoice%20OCR.user.js
// @updateURL https://update.greasyfork.org/scripts/556362/EDC%20Invoice%20OCR.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function filterDarkBackground(canvas) {
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const brightness = (0.299 * r + 0.587 * g + 0.114 * b);

            // If pixel is bright (Text), make it BLACK (0).
            // Otherwise (Background), make it WHITE (255).
            if (brightness > 150) {
                data[i] = 0;
                data[i+1] = 0;
                data[i+2] = 0;
            } else {
                data[i] = 255;
                data[i+1] = 255;
                data[i+2] = 255;
            }
        }
        ctx.putImageData(imageData, 0, 0);
        return canvas;
    }

    function filterGreenBox(canvas) {
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const brightness = (0.299 * r + 0.587 * g + 0.114 * b);
            const isGreen = (g > 150 && r < 150 && b < 150);

            if (brightness > 200) { // Very bright pixel (The White Text)
                data[i] = 0;     // Text is Black
                data[i+1] = 0;
                data[i+2] = 0;
            } else if (isGreen) {
                data[i] = 255;   // Background is White
                data[i+1] = 255;
                data[i+2] = 255;
            } else { // e.g., dark borders
                data[i] = 255;
                data[i+1] = 255;
                data[i+2] = 255;
            }
        }
        ctx.putImageData(imageData, 0, 0);
        return canvas;
    }

    async function runOCR(btn, regexPattern, mode) {
        btn.disabled = true;
        btn.textContent = 'Capturing...';
        btn.style.backgroundColor = '#999';
        try {
            const fullCanvas = await html2canvas(document.body, {
                scale: 2.5, // Even higher scale for sharper text
                useCORS: true,
                allowTaint: true,
                ignoreElements: (el) => el.tagName === 'BUTTON'
            });
            let startY, cropHeight, cropWidth;
            if (mode === 'PRICE') {
                startY = fullCanvas.height * 0.1; // start around 10% from top
                cropHeight = fullCanvas.height * 0.15; // 15% height should cover it
                cropWidth = fullCanvas.width;
            } else { // INV
                startY = fullCanvas.height * 0.20; // Start below the green box
                cropHeight = fullCanvas.height * 0.25;
                cropWidth = fullCanvas.width;
            }

            const croppedCanvas = document.createElement('canvas');
            croppedCanvas.width = cropWidth;
            croppedCanvas.height = cropHeight;
            const ctx = croppedCanvas.getContext('2d');


            ctx.drawImage(fullCanvas, // Draw only the cropped area
                0, startY, cropWidth, cropHeight, // Source (fullCanvas)
                0, 0, cropWidth, cropHeight      // Destination (croppedCanvas)
            );
            btn.textContent = 'Filtering...';
            if (mode === 'PRICE') {
                filterGreenBox(croppedCanvas);
            } else {
                filterDarkBackground(croppedCanvas);
            }

            // Show processed image for debugging purpose
            document.body.appendChild(croppedCanvas);
            croppedCanvas.style.cssText = `position:fixed; bottom:10px; left:10px; width: 400px; border:2px solid ${mode === 'PRICE' ? 'green' : 'red'}; z-index:10000;`;

            btn.textContent = 'Finding...';
            const { data: { text } } = await Tesseract.recognize(croppedCanvas, 'eng'); // eng+khm

            console.log(`[${mode}] OCR Output:`, text);
            const match = text.match(regexPattern);

            if (match) {
                let result = match[0];
                if (mode === 'PRICE') {
                    result = result.replace(/[^\d,.]/g, ''); // Remove spaces and anything that isn't a digit or comma/dot
                }

                GM_setClipboard(result);
                btn.textContent = result + ' Copied!';
                btn.style.backgroundColor = '#4caf50';
            } else {
                alert(`Pattern not found in the processed image for ${mode}. Check Console (F12) to see what Tesseract read.`);
                btn.textContent = 'Failed';
                btn.style.backgroundColor = 'red';
            }

        } catch (err) {
            console.error(err);
            alert(`Error during ${mode} capture. Check console.`);
            btn.textContent = 'Error';
            btn.style.backgroundColor = 'red';
        } finally {
            setTimeout(() => {
                btn.disabled = false;
                btn.textContent = mode === 'INV' ? 'Scan INV/' : 'Scan ៛';
                btn.style.backgroundColor = mode === 'INV' ? '#d32f2f' : '#0288d1';
            }, 3000);
        }
    }
function createContainer(topPercent) {
    const container = document.createElement('div');
    container.id = 'ocr-button-container';
    Object.assign(container.style, {
        position: 'fixed',
        top: topPercent,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10000,
        display: 'flex',
        //flexDirection: 'column',
        gap: '10px',
        alignItems: 'center',
        padding: '10px',
        background: 'rgba(33, 33, 33, 0.8)',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
    });
    document.body.appendChild(container);
    return container;
}

    function createBtn(text, container, color, regex, mode) {
        const btn = document.createElement('button');
        btn.textContent = text;
        Object.assign(btn.style, {
            padding: '8px 12px',
            backgroundColor: color,
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontFamily: 'sans-serif',
            fontWeight: 'bold',
            width: '150px' // Give buttons a uniform width
    });

        btn.onclick = () => runOCR(btn, regex, mode);
        container.appendChild(btn);
    }
    setTimeout(() => {
        const buttonContainer = createContainer('0%');
        createBtn('Scan for INV/', buttonContainer, '#d32f2f', /INV\/\d+/, 'INV');
        // regx : Looks for a number that contains a comma | (backup):  /[៛]?\s?[\d]+[\s,，٫٬]+[\d]+/
        createBtn('Scan for ៛', buttonContainer, '#0288d1', /\d{1,3}[,.]\d{3}/, 'PRICE');
    }, 2000);

})();