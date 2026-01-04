// ==UserScript==
// @name         Slideshare: Download Slides as PDF
// @namespace    https://naeembolchhi.github.io/
// @version      0.1
// @description  Download slides from Slideshare as PDF files.
// @author       NaeemBolchhi
// @license      GPL-3.0-or-later
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgdmlld0JveD0iMCAwIDI0IDI0Ij48Y2lyY2xlIGZpbGw9IiNmYTUiIGN4PSIxMiIgY3k9IjEyIiByPSIxMiIvPjxwYXRoIGQ9Ik0xOC41OCA2LjE1SDkuNDljLS41MSAwLS45Mi40MS0uOTIuOTJ2MS45OWMwIC41MS0uNDIuOTItLjkyLjkySDUuNDNjLS41MSAwLS45Mi40MS0uOTIuOTJ2Ni4wNGMwIC41MS40MS45Mi45Mi45Mmg5LjEzYy41MSAwIC45Mi0uNDEuOTItLjkydi0xLjk5YzAtLjUxLjQxLS45Mi45Mi0uOTJoMi4xOWMuNTEgMCAuOTItLjQyLjkyLS45MlY3LjA3YzAtLjUxLS40Mi0uOTItLjkyLS45MlptLTMuNDYgNy40MmMwIC4yNS0uMjEuNDYtLjQ2LjQ2SDkuMzRjLS4yNiAwLS40Ni0uMjEtLjQ2LS40NnYtMy4xNGMwLS4yNi4yMS0uNDYuNDYtLjQ2aDUuMzJjLjI1IDAgLjQ2LjIxLjQ2LjQ2djMuMTRaIiBmaWxsPSIjMzEyZTU2IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz48L3N2Zz4=
// @match        http*://www.slideshare.net/slideshow/*
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/558353/Slideshare%3A%20Download%20Slides%20as%20PDF.user.js
// @updateURL https://update.greasyfork.org/scripts/558353/Slideshare%3A%20Download%20Slides%20as%20PDF.meta.js
// ==/UserScript==

// Add PDF-Lib to DOM
function addLib() {
    let pl = document.createElement('script');

    pl.src = 'https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.js';
    pl.setAttribute('type','text/javascript');

    document.head.appendChild(pl);
}
addLib();

// Make an array full of links from the slide images
function generateLinkList() {
    let imgList = document.querySelectorAll('img[id*="slide-image-"]'),

        imgLinks = [];

    for (x = 0; x < imgList.length; x++) {
        imgLinks.push(imgList[x].src);
    }
    
    // Set total slide count for progressbar
    document.querySelector('#RG93bmxvYWQgQnV0dG9u').setAttribute('style','--_total-slides: ' + imgList.length);

    return imgLinks;
}

// Convert image to png from any format
async function imageUrlToPngBase64(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;

            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);

            try {
                const pngBase64 = canvas.toDataURL("image/png");
                resolve(pngBase64);
            } catch (err) {
                reject(err);
            }
        };
        img.onerror = reject;
        img.src = url;
    });
}

// Generate and download a pdf file from an array of images
async function createPdfFromImages(imageUrls) {
    // get filename from title
    const filename = document.querySelector('h1.heading').textContent;

    // Create a new PDF document
    const pdfDoc = await PDFLib.PDFDocument.create(),
          pbar = document.querySelector('#RG93bmxvYWQgQnV0dG9u progressbar');

    // for (const imageUrl of imageUrls) {
    for (let x = 0; x < imageUrls.length; x++) {
        let imageUrl = imageUrls[x];
        let imageBytes;
        let image;

        try {
            // Fetch the image bytes from the URL
            const response = await fetch(await imageUrlToPngBase64(imageUrl));
            if (!response.ok) {
                throw new Error(`Failed to fetch image: ${response.statusText}`);
            } else {
                // Update percentage in UI
                pbar.setAttribute('style','--_completed-slides: ' + (x+1));
            }
            imageBytes = await response.arrayBuffer();

            // Determine image type and embed it
            const contentType = response.headers.get('content-type');

            if (contentType.includes('image/jpeg')) {
                image = await pdfDoc.embedJpg(imageBytes);
            } else if (contentType.includes('image/png')) {
                image = await pdfDoc.embedPng(imageBytes);
            } else {
                console.warn(`Skipping unsupported image type: ${contentType} for URL: ${imageUrl}`);
                continue;
            }

        } catch (error) {
            console.error(`Error processing image URL ${imageUrl}:`, error);
            continue;
        }

        // Get the embedded image's dimensions
        const imageWidth = image.width;
        const imageHeight = image.height;

        // Add a new page with the exact dimensions of the image
        // The dimensions are used as [width, height] for the page size.
        const page = pdfDoc.addPage([imageWidth, imageHeight]);

        // Draw the image, filling the entire page
        // Since the page size matches the image size, we draw it from the
        // bottom-left corner (0, 0) to fill the full width and height.
        page.drawImage(image, {
            x: 0,
            y: 0,
            width: imageWidth,
            height: imageHeight,
        });
    }

    // Serialize the PDF document to bytes
    const pdfBytes = await pdfDoc.save();

    // Create a Blob and trigger the download
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);

    setTimeout(() => {
        pbar.classList.remove('show');
        pbar.setAttribute('style','--_completed-slides: 0');
    }, 750);
}

// Main activity for this script
async function dothething(imageUrls) {
    // Determine image extension
    function getMimeType(url) {
        const ext = url.split(".").pop().split("?")[0].toLowerCase();

        const mimeMap = {
            jpg: "image/jpeg",
            jpeg: "image/jpeg",
            png: "image/png",
            gif: "image/gif",
            webp: "image/webp",
            bmp: "image/bmp",
            svg: "image/svg+xml"
        };

        return mimeMap[ext] || "application/octet-stream";
    }

    // Make Base64
    function fetchImageBase64(url) {
        return new Promise((resolve, reject) => {

            const mimeType = getMimeType(url);

            GM_xmlhttpRequest({
                method: "GET",
                url,
                responseType: "arraybuffer",

                onload: (response) => {
                    try {
                        const bytes = new Uint8Array(response.response);
                        let binary = "";

                        for (let i = 0; i < bytes.length; i++) {
                            binary += String.fromCharCode(bytes[i]);
                        }

                        const base64 = btoa(binary);
                        resolve(`data:${mimeType};base64,${base64}`);
                    } catch (e) {
                        reject(e);
                    }
                },

                onerror: (err) => reject(err)
            });
        });
    }

    // Make array with all Base64 strings
    async function buildBase64Array(urls) {
        return await Promise.all(
            urls.map(url => fetchImageBase64(url))
        );
    }

    // Execute main function
    async function main() {
        const dspan = document.querySelector('#RG93bmxvYWQgQnV0dG9u span'),
              dspantemp = dspan.textContent;
        dspan.textContent = 'Downloading...';

        console.log("Fetching all images...");

        const base64Array = await buildBase64Array(imageUrls),
              pbar = document.querySelector('#RG93bmxvYWQgQnV0dG9u progressbar');

        pbar.setAttribute('style','--_completed-slides: 0');
        pbar.classList.add('show');

        await createPdfFromImages(base64Array);
        dspan.textContent = dspantemp;
    }

    // Run
    main();
}

// Define styles
const uiStyles = `
#RG93bmxvYWQgQnV0dG9u {
  height: 2rem;
  width: -moz-fit-content;
  width: fit-content;
  background: var(--color-orange-700);
  border-radius: 1rem;
  margin-bottom: 12px;
  padding: 4px 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-black);
  cursor: pointer;
  gap: 4px;
}
#RG93bmxvYWQgQnV0dG9u > .download-icon {
  height: 100%;
  aspect-ratio: 1/1;
}
#RG93bmxvYWQgQnV0dG9u > span {
  margin-bottom: 1px;
  margin-right: 5px;
}
#RG93bmxvYWQgQnV0dG9u:hover {
  background: var(--color-orange-800);
}
#RG93bmxvYWQgQnV0dG9u:active {
  background: var(--color-orange-700);
}
#RG93bmxvYWQgQnV0dG9u progressbar:not(.show) {
  display: none;
}
#RG93bmxvYWQgQnV0dG9u progressbar {
  position: fixed;
  display: block;
  width: calc(1svw * var(--_completed-slides) / var(--_total-slides) * 100);
  height: 0.6rem;
  top: -0.35rem;
  left: 0;
  background: var(--color-orange-700);
  z-index: 999;
  filter: blur(2px);
  transition: width 0.1s linear;
}/*# sourceMappingURL=b2.part.css.map */
`;

// Add Styles to DOM
function addStyles() {
    let st = document.createElement('style');

    st.textContent = uiStyles;
    st.setAttribute('type','text/css');

    document.head.appendChild(st);
}
addStyles();

// Add UI to DOM
function addUI() {
    if (document.querySelector('#RG93bmxvYWQgQnV0dG9u')) {return;}

    let newDiv = document.createElement('div');

    newDiv.id = 'RG93bmxvYWQgQnV0dG9u';
    // newDiv.classList.add('title');
    newDiv.innerHTML = `
        <svg class="download-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z"/></svg>
        <span>Download as PDF</span>
        <progressbar style="--_completed-slides: 0"></progressbar>
    `;

    document.querySelector('h1.heading').parentNode.insertBefore(newDiv, document.querySelector('h1.heading+*'));
}

try {addUI();} catch {}

window.addEventListener("load", () => {
    try {addUI();} catch {}
});
// Detect click on download button and run main activity
document.addEventListener('click', (e) => {
    if (!e.target.closest('#RG93bmxvYWQgQnV0dG9u')) {return;}
    if (document.querySelector('#RG93bmxvYWQgQnV0dG9u progressbar').classList.contains('show')) {return;}
    dothething(generateLinkList());
});
