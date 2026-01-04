// ==UserScript==
// @name         ORT TP Downloader
// @namespace    http://tampermonkey.net/
// @version      3.0.3
// @description  Descarga TPs del Campus Virtual ORT con adjuntos, consigna, entrega actual, entregas anteriores, metadata y barra de progreso
// @match        https://campus.ort.edu.ar/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      *
// @license      Unlicense
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/557939/ORT%20TP%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/557939/ORT%20TP%20Downloader.meta.js
// ==/UserScript==

(function() {
'use strict';

/* ================================
    ESTILOS (Barra de progreso y Botón)
================================ */
// Se mantienen los !important aquí para asegurar que el botón y la barra de progreso
// de Tampermonkey no sean afectados por estilos externos del campus.
GM_addStyle(`
#tpDownloadButton {
    position: fixed !important;
    bottom: 20px !important;
    right: 20px !important;
    background: #005bb5 !important;
    color: white !important;
    padding: 12px 18px !important;
    border-radius: 8px !important;
    border: none !important;
    font-size: 14px !important;
    cursor: pointer !important;
    z-index: 999999 !important;
}
#tpProgressBox {
    position: fixed;
    bottom: 70px;
    right: 20px;
    width: 260px;
    background: #1c1c1c;
    border-radius: 8px;
    padding: 10px;
    color: white;
    font-size: 13px;
    display: none;
    z-index: 999999;
}
#tpProgressBar {
    width: 100%;
    background: #333;
    height: 10px;
    border-radius: 6px;
    overflow: hidden;
    margin-top: 6px;
}
#tpProgressFill {
    height: 100%;
    background: #4caf50;
    width: 0%;
    transition: width 0.15s linear;
}
`);


/* ================================
    CSS BASE PARA CONTENIDO.HTML (SIMPLIFICADO)
================================ */
const ORT_BASE_CSS = `
/* ort_base.css - Estilos básicos y primitivos para contenido.html */
body {
    font-family: sans-serif;
    color: #444;
    background-color: #f7f7f7;
    margin: 0;
    padding: 15px;
    line-height: 1.5;
}
.bodyContenedor {
    background-color: #fff;
    padding: 20px;
    border-radius: 4px;
    border: 1px solid #ccc; /* Borde simple sin sombra */
}
h2 {
    color: #005bb5; /* Color ORT azul */
    border-bottom: 2px solid #ccc;
    padding-bottom: 8px;
    margin-bottom: 15px;
}
.cajaAmigoHeader {
    background-color: #005bb5; /* Color ORT azul */
    color: white;
    padding: 8px 10px;
    border-radius: 4px 4px 0 0;
    font-weight: bold;
    margin: 0;
    display: flex;
    align-items: center;
}
.white-text {
    color: white;
}
.bold {
    font-weight: bold;
}
a {
    color: #007bff;
    text-decoration: none;
}
a:hover {
    text-decoration: underline;
}
.valign-wrapper {
    display: flex;
    align-items: center;
}
.marginRight10 {
    margin-right: 10px;
}
/* Estilo básico para botones de descarga */
.btn-floating {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: #2196F3; /* Azul */
    color: white;
    flex-shrink: 0;
    margin-right: 5px;
    border: none;
}
.material-icons {
    /* No se usa fuente externa, se usa un tamaño simple */
    font-size: 18px;
    line-height: 1;
}
.collection-item {
    border-bottom: 1px solid #e0e0e0;
    padding: 8px 0;
}
.collection-item:last-child {
    border-bottom: none;
}
.col {
    padding: 0 5px;
}
.card-action > div {
    gap: 10px;
    display: flex;
}
`;
/* ================================
    FIN CSS BASE SIMPLIFICADO
================================ */


/* ================================
    UI BARRA DE PROGRESO
================================ */
function createProgressUI() {
    if (document.querySelector("#tpProgressBox")) return;

    const box = document.createElement("div");
    box.id = "tpProgressBox";
    box.innerHTML = `
        <div id="tpProgressText">Preparando…</div>
        <div id="tpProgressBar"><div id="tpProgressFill"></div></div>
    `;
    document.body.appendChild(box);
}

function setProgress(percentage, text) {
    document.querySelector("#tpProgressBox").style.display = "block";
    document.querySelector("#tpProgressFill").style.width = percentage + "%";
    document.querySelector("#tpProgressText").textContent = text;
}

function hideProgress() {
    document.querySelector("#tpProgressBox").style.display = "none";
}

/* ================================
    DETECTOR TP (/tp/<id>/<slug>)
================================ */
function getTpInfo() {
    const parts = location.pathname.split("/").filter(Boolean);
    const tpIndex = parts.indexOf("tp");
    if (tpIndex === -1 || parts.length < tpIndex + 3) return null;
    return {
        id: parts[tpIndex + 1],
        slug: parts[tpIndex + 2]
    };
}

/* ================================
    AGREGAR BOTÓN SOLO EN TPs
================================ */
function addButton() {
    if (!getTpInfo()) return;
    if (!document.querySelector(".bodyContenedor")) return;
    if (document.querySelector("#tpDownloadButton")) return;

    const b = document.createElement("button");
    b.id = "tpDownloadButton";
    b.textContent = "⬇ Descargar TP Completo";
    b.onclick = downloadZip;
    document.body.appendChild(b);
}

/* ================================
    FETCH AVANZADO
================================ */
function fetchBinaryDetailed(url) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "GET",
            url,
            responseType: "arraybuffer",
            onload: r => resolve({ buffer: r.response, headers: r.responseHeaders }),
            onerror: err => reject(err)
        });
    });
}

function filenameFromHeaders(headers, fallback) {
    const m = headers.match(/filename="?([^"]+)"?/i);
    return m ? m[1] : fallback;
}

function extensionFromHeaders(headers) {
    const ct = headers.match(/content-type:\s*([^;\r\n]+)/i);
    if (!ct) return null;

    const mime = ct[1].toLowerCase();
    const map = {
        "application/pdf": "pdf",
        "application/zip": "zip",
        "application/x-zip-compressed": "zip",
        "application/msword": "doc",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
        "application/vnd.ms-powerpoint": "ppt",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
        "application/vnd.ms-excel": "xls",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
        "image/jpeg": "jpg",
        "image/png": "png",
        "image/gif": "gif"
    };
    return map[mime] || null;
}

/* ================================
    PROCESAR CONSIGNA (IFRAME ORT)
================================ */
async function processIframe(iframe, zip, progress) {
    const src = iframe.getAttribute("src");
    if (!src) return;

    const baseURL = new URL(src, location.href);

    progress.step("Consigna");

    const raw = await fetchBinaryDetailed(baseURL.href);
    const html = new TextDecoder().decode(raw.buffer);

    const folder = zip.folder("consigna");
    const doc = new DOMParser().parseFromString(html, "text/html");

    const assets = [...doc.querySelectorAll("img[src], script[src], link[href]")];

    for (const el of assets) {
        const attr = el.tagName === "LINK" ? "href" : "src";
        const resURL = el.getAttribute(attr);
        if (!resURL) continue;

        const abs = new URL(resURL, baseURL);
        if (!abs.hostname.endsWith(".ort.edu.ar")) continue;

        const filename = abs.pathname.split("/").pop();
        progress.step("Consigna: " + filename);

        try {
            const bin = await fetchBinaryDetailed(abs.href);
            folder.file(filename, bin.buffer);
            el.setAttribute(attr, filename);
        } catch {}
    }

    folder.file("index.html", doc.documentElement.outerHTML);
}

/* ================================
    DESCARGAR TODO EL TP
================================ */
async function downloadZip() {
    createProgressUI();

    const info = getTpInfo();
    const id = info.id;
    const slug = info.slug;
    const safeSlug = slug.replace(/[^a-z0-9\-]/gi, "_");

    const body = document.querySelector(".bodyContenedor");
    // Creamos una copia del HTML para modificar sus enlaces sin afectar la página actual
    const htmlCopy = body.cloneNode(true);

    const zip = new JSZip();

    /* ================================
        RECOLECCIÓN DE ARCHIVOS PRINCIPALES
    ================================ */

    const targets = [];
    const downloadedUrls = new Set(); // Para evitar descargar la misma URL varias veces

    // 1. Adobe PDF Viewers (ORT's internal PDF viewer)
    [...htmlCopy.querySelectorAll("div.placeholderParaPdf[data-ubicacionarchivo]")].forEach(div => {
        // Remove the internal iframe to prevent it from being processed as a regular consigna iframe
        const iframe = div.querySelector('iframe');
        if (iframe) iframe.remove();

        targets.push({
            type: "adobePdfViewer",
            element: div,
            filenameAttr: div.getAttribute("data-nombrearchivo"),
            urlPath: div.getAttribute("data-ubicacionarchivo")
        });
    });

    // 2. Google Viewer and Standard ORT Consigna iframes
    [...htmlCopy.querySelectorAll("iframe")].forEach(ifr => {
        const src = ifr.getAttribute("src");
        if (src && src.includes("docs.google.com/viewer?url=")) {
            targets.push({ type: "googleViewerIframe", iframe: ifr, src: src });
        } else {
            targets.push({ type: "iframe", iframe: ifr });
        }
    });

    // Encuentra los elementos de enlace originales en htmlCopy

    // Entrega actual
    const elEntregaActual = htmlCopy.querySelector("a[href*='descargarentrega/']");
    if (elEntregaActual) targets.push({ type: "entregaActual", url: elEntregaActual.href, element: elEntregaActual });

    // Entregas anteriores
    const elEntregasViejas = [...htmlCopy.querySelectorAll("a[href*='descargarentregavieja/']")];
    elEntregasViejas.forEach(a => targets.push({ type: "entregaVieja", url: a.href, element: a }));

    // Devolución del docente (corrección)
    const elDevolucionDocente = htmlCopy.querySelector("a[href*='descargardevolucion/']");
    if (elDevolucionDocente) targets.push({ type: "devolucionDocente", url: elDevolucionDocente.href, element: elDevolucionDocente });

    // Adjunto directo de la consigna
    const elAdjuntoConsigna = htmlCopy.querySelector("a[href*='/descargar/tp/']");
    if (elAdjuntoConsigna) targets.push({ type: "adjuntoConsigna", url: elAdjuntoConsigna.href, element: elAdjuntoConsigna });

    // Adjuntos internos (links con extensiones comunes)
    const adjLinks = [...htmlCopy.querySelectorAll("a[href]")].filter(a => {
        try {
            const u = new URL(a.href, location.href);
            // Evitar duplicados de los tipos ya recolectados
            if (a.href.includes('descargarentrega/') || a.href.includes('descargarentregavieja/') || a.href.includes('descargardevolucion/') || a.href.includes('/descargar/tp/')) {
                return false;
            }
            // Solo dominios ORT y adjuntos directos con extensiones comunes
            return u.hostname.endsWith(".ort.edu.ar") &&
                   /\.(pdf|jpg|jpeg|png|gif|doc|docx|ppt|pptx|xlsx|xls|zip|rar)$/i.test(u.pathname);
        } catch { return false; }
    });

    adjLinks.forEach(a => {
        // Aseguramos que solo se descarguen una vez
        if (!downloadedUrls.has(a.href)) {
            targets.push({ type: "adjunto", url: a.href, element: a });
            downloadedUrls.add(a.href);
        }
    });

    /* ================================
        RECOLECCIÓN DE RECURSOS ESTÁTICOS
    ================================ */
    const staticResources = [];
    // Buscar IMG, LINK (CSS), SCRIPT
    const resourceElements = [...htmlCopy.querySelectorAll("img[src], link[href], script[src]")];

    resourceElements.forEach(el => {
        const attr = el.tagName === "LINK" ? "href" : "src";
        const urlAttr = el.getAttribute(attr);

        if (urlAttr) {
            try {
                const u = new URL(urlAttr, location.href);
                // Solo dominios ORT y URLs no procesadas
                if (u.hostname.endsWith(".ort.edu.ar") && !downloadedUrls.has(u.href)) {
                    staticResources.push({ url: u.href, element: el, attr: attr });
                    downloadedUrls.add(u.href);
                }
            } catch {}
        }
    });


    /* ================================
        PROGRESO
    ================================ */
    const progress = {
        done: 0,
        // Sumamos targets principales + recursos estáticos + CSS base + limpieza de iconos + zip final
        total: targets.length + staticResources.length + 3,
        percent() { return Math.round((this.done / this.total) * 100); },
        step(text) {
            this.done++;
            setProgress(this.percent(), text);
        }
    };

    /* ================================
        DESCARGA UNO POR UNO (ARCHIVOS PRINCIPALES)
    ================================ */
    for (const t of targets) {
        if (t.type === "iframe") {
            // Maneja iframes de consigna (ORT)
            await processIframe(t.iframe, zip, progress);
            t.iframe.setAttribute("src", "consigna/index.html");
        }
        else if (t.type === "googleViewerIframe") {
            // Maneja iframes de Google Docs Viewer
            const iframeURL = new URL(t.src);
            const documentURLParam = iframeURL.searchParams.get("url");

            if (!documentURLParam) {
                progress.step("Viewer: URL no encontrada, omitiendo.");
                t.iframe.outerHTML = `<p style="color: red; background-color: #ffebee; padding: 10px; border-radius: 4px;">[AVISO: Iframe de Google Viewer sin URL de documento, se omitió.]</p>`;
                continue;
            }

            // La URL del documento está codificada en el parámetro 'url'
            const realDocumentURL = decodeURIComponent(documentURLParam);

            progress.step("Viewer: " + realDocumentURL.split("/").pop());

            try {
                const { buffer, headers } = await fetchBinaryDetailed(realDocumentURL);

                let filename = filenameFromHeaders(headers, realDocumentURL.split("/").pop());
                let ext = filename.match(/\.([a-z0-9]+)$/i)?.[1] || extensionFromHeaders(headers) || "bin";
                if (!filename.includes(".")) filename += "." + ext;

                // Asegurar un nombre de archivo único si es necesario
                if (filename.startsWith("viewer") || filename.includes("?")) {
                    filename = `documento_viewer_${id}_${safeSlug}.${ext}`;
                }

                zip.folder("documentos_viewer").file(filename, buffer);
                const localPath = `documentos_viewer/${filename}`;

                // Crear el reemplazo: un div con un enlace estilizado
                const wrapper = document.createElement('div');
                wrapper.innerHTML = `
                    <div style="background-color: #e0f7fa; padding: 10px; border: 1px solid #b2ebf2; border-radius: 4px; margin: 10px 0;">
                        <p style="margin: 0; font-weight: bold;">
                            <a href="${localPath}" style="color: #00796B; text-decoration: none;">
                                ⬇ Documento Incrustado Descargado (Google Viewer): ${filename}
                            </a>
                        </p>
                        <small style="color: #00796B;">El visor de Google Docs ha sido reemplazado por un enlace al archivo local.</small>
                    </div>
                `;

                // Reemplazar el iframe por el wrapper con el enlace
                t.iframe.parentNode.replaceChild(wrapper, t.iframe);

            } catch (e) {
                console.error("Error al descargar documento de Google Viewer:", realDocumentURL, e);
                progress.step("Viewer: Error, reemplazando con texto.");
                t.iframe.outerHTML = `<p style="color: red; background-color: #ffebee; padding: 10px; border-radius: 4px;">[ERROR: No se pudo descargar el documento incrustado. URL original: ${realDocumentURL}]</p>`;
            }
        }
        else if (t.type === "adobePdfViewer") {
            // Maneja el visor de PDF interno de ORT (NUEVO)
            const fullURL = new URL(t.urlPath, location.origin).href;
            let filename = t.filenameAttr;

            // Forzar la extensión a .pdf, como se especifica en la solicitud del usuario
            if (!filename.toLowerCase().endsWith('.pdf')) {
                filename = filename.replace(/\.\w+$/, '') + '.pdf';
            }

            progress.step("Adobe PDF: " + filename);

            try {
                const { buffer } = await fetchBinaryDetailed(fullURL);
                const localPath = `documentos_viewer/${filename}`;

                // Usamos la misma carpeta 'documentos_viewer' para centralizar documentos incrustados
                zip.folder("documentos_viewer").file(filename, buffer);

                // Crear el reemplazo: un div con un enlace estilizado
                const wrapper = document.createElement('div');
                wrapper.innerHTML = `
                    <div style="background-color: #e0f7fa; padding: 10px; border: 1px solid #b2ebf2; border-radius: 4px; margin: 10px 0;">
                        <p style="margin: 0; font-weight: bold;">
                            <a href="${localPath}" style="color: #00796B; text-decoration: none;">
                                ⬇ Documento PDF Descargado: ${filename}
                            </a>
                        </p>
                        <small style="color: #00796B;">El visor de PDF de ORT ha sido reemplazado por un enlace al archivo local.</small>
                    </div>
                `;

                // Reemplazar el elemento div original por el wrapper con el enlace
                t.element.parentNode.replaceChild(wrapper, t.element);

            } catch (e) {
                console.error("Error al descargar PDF de Adobe Viewer:", fullURL, e);
                progress.step("Adobe PDF: Error, reemplazando con texto.");
                t.element.outerHTML = `<p style="color: red; background-color: #ffebee; padding: 10px; border-radius: 4px;">[ERROR: No se pudo descargar el PDF incrustado. URL de descarga: ${fullURL}]</p>`;
            }
        }
        else if (t.type === "adjunto") {
            const u = new URL(t.url, location.href);

            progress.step("Adjunto: " + t.element.textContent.trim().substring(0, 30));

            try {
                const { buffer, headers } = await fetchBinaryDetailed(u.href);

                let filename = filenameFromHeaders(headers, u.pathname.split("/").pop());
                let ext = filename.match(/\.([a-z0-9]+)$/i)?.[1] || extensionFromHeaders(headers) || "bin";
                if (!filename.includes(".")) filename += "." + ext;

                zip.folder("adjuntos").file(filename, buffer);
                // Sustituir URL con ruta relativa
                t.element.setAttribute("href", `adjuntos/${filename}`);

            } catch {}
        }
        else if (t.type === "entregaActual") {
            const u = new URL(t.url, location.href);
            progress.step("Entrega actual");

            try {
                const { buffer, headers } = await fetchBinaryDetailed(u.href);

                let filename = filenameFromHeaders(headers, u.pathname.split("/").pop());
                let ext = filename.match(/\.([a-z0-9]+)$/i)?.[1] || extensionFromHeaders(headers) || "bin";
                if (!filename.includes(".")) filename += "." + ext;

                zip.folder("entregas").folder("actual").file(filename, buffer);
                // Sustituir URL con ruta relativa
                t.element.setAttribute("href", `entregas/actual/${filename}`);

            } catch {}
        }
        else if (t.type === "entregaVieja") {
            const u = new URL(t.url, location.href);
            progress.step("Entrega anterior");

            try {
                const { buffer, headers } = await fetchBinaryDetailed(u.href);

                let filename = filenameFromHeaders(headers, u.pathname.split("/").pop());
                let ext = filename.match(/\.([a-z0-9]+)$/i)?.[1] || extensionFromHeaders(headers) || "bin";
                if (!filename.includes(".")) filename += "." + ext;

                zip.folder("entregas").folder("anteriores").file(filename, buffer);
                // Sustituir URL con ruta relativa
                t.element.setAttribute("href", `entregas/anteriores/${filename}`);

            } catch {}
        }
        // Manejo de la devolución del docente (Corrección)
        else if (t.type === "devolucionDocente") {
            const u = new URL(t.url, location.href);
            progress.step("Devolución docente (Corrección)");

            try {
                const { buffer, headers } = await fetchBinaryDetailed(u.href);

                let filename = filenameFromHeaders(headers, u.pathname.split("/").pop());
                if (!filename.includes(".")) filename = "correccion_" + filename;
                let ext = filename.match(/\.([a-z0-9]+)$/i)?.[1] || extensionFromHeaders(headers) || "bin";
                if (!filename.includes(".")) filename += "." + ext;

                if (filename.startsWith("descargardevolucion")) {
                    filename = `correccion_docente_${u.pathname.split("/").pop()}.${ext}`;
                }

                zip.folder("entregas").folder("correccion").file(filename, buffer);
                // Sustituir URL con ruta relativa
                t.element.setAttribute("href", `entregas/correccion/${filename}`);


            } catch {}
        }
        // Manejo del adjunto directo de la consigna
        else if (t.type === "adjuntoConsigna") {
            const u = new URL(t.url, location.href);
            progress.step("Adjunto Consigna");

            try {
                const { buffer, headers } = await fetchBinaryDetailed(u.href);

                let filename = filenameFromHeaders(headers, u.pathname.split("/").pop());
                let ext = filename.match(/\.([a-z0-9]+)$/i)?.[1] || extensionFromHeaders(headers) || "bin";
                if (!filename.includes(".")) filename += "." + ext;

                if (filename.startsWith("descargar")) {
                    filename = `adjunto_consigna_${u.pathname.split("/").pop()}.${ext}`;
                }

                zip.folder("consigna").folder("adjunto").file(filename, buffer);
                // Sustituir URL con ruta relativa
                t.element.setAttribute("href", `consigna/adjunto/${filename}`);

            } catch {}
        }
    }

    /* ================================
        DESCARGA DE RECURSOS ESTÁTICOS
    ================================ */
    const recursosFolder = zip.folder("recursos");

    for (const t of staticResources) {
        progress.step("Recurso Estático: " + t.url.split("/").pop());

        try {
            const { buffer, headers } = await fetchBinaryDetailed(t.url);

            let filename = filenameFromHeaders(headers, t.url.split("/").pop());
            let ext = filename.match(/\.([a-z0-9]+)$/i)?.[1] || extensionFromHeaders(headers) || "bin";
            if (!filename.includes(".")) filename += "." + ext;

            // Generar un nombre de archivo seguro
            let safeFilename = filename.replace(/[^a-z0-9\.\-_]/gi, "_");

            // Asegurar un nombre de archivo único
            let uniqueFilename = safeFilename;
            let counter = 1;

            // Revisa si ya existe un archivo con esta ruta en el ZIP.
            while (zip.files[`recursos/${uniqueFilename}`]) {
                const parts = safeFilename.split('.');
                const extension = parts.length > 1 ? '.' + parts.pop() : '';
                const name = parts.join('.');

                // El nombre base debe ser el original sin el contador
                const baseName = name.replace(/_\d+$/, '');

                uniqueFilename = `${baseName}_${counter}${extension}`;
                counter++;
            }

            recursosFolder.file(uniqueFilename, buffer);

            // Sustituir la URL original con la ruta relativa en htmlCopy
            t.element.setAttribute(t.attr, `recursos/${uniqueFilename}`);

        } catch (e) {
            console.error("Error al descargar recurso estático:", t.url, e);
        }
    }

    /* ================================
        LIMPIEZA FINAL DE ICONOS
    ================================ */
    progress.step("Limpiando iconos...");
    // Reemplaza el texto "file_download" por el carácter de flecha hacia abajo
    [...htmlCopy.querySelectorAll(".material-icons")].forEach(el => {
        if (el.textContent.trim() === "file_download") {
            el.textContent = "⬇";
        }
    });

    /* ================================
        contenido.html
    ================================ */
    progress.step("Añadiendo CSS base...");
    // 1. Incluimos el CSS base en el ZIP
    zip.file("ort_base.css", ORT_BASE_CSS);

    // 2. Generamos el HTML con el enlace al CSS
    zip.file("contenido.html",
        `<html>
            <head>
                <meta charset="UTF-8">
                <title>${document.querySelector("h2")?.innerText || slug}</title>
                <link rel="stylesheet" href="ort_base.css">
            </head>
            <body>
                ${htmlCopy.outerHTML}
            </body>
        </html>`
    );

    /* ================================
        metadata.json
    ================================ */
    zip.file("metadata.json", JSON.stringify({
        titulo: document.querySelector("h2")?.innerText || slug,
        url: location.href,
        fecha: new Date().toISOString(),
        id,
        slug
    }, null, 4));

    /* ================================
        CREAR ZIP FINAL
    ================================ */
    progress.step("Creando ZIP…");

    const blob = await zip.generateAsync({ type: "blob" });
    hideProgress();
    saveAs(blob, `${id}_${safeSlug}.zip`);
}

setTimeout(addButton, 1200);

})();