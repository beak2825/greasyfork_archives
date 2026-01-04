// ==UserScript==
// @name         Vinted Downloader ZIP Photos
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Télécharge toutes les photos d’une annonce Vinted dans un fichier ZIP via JSZip (userscript)
// @author       AI
// @match        https://www.vinted.fr/items/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548685/Vinted%20Downloader%20ZIP%20Photos.user.js
// @updateURL https://update.greasyfork.org/scripts/548685/Vinted%20Downloader%20ZIP%20Photos.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Charger JSZip depuis CDN de manière dynamique
    function loadJSZip() {
        return new Promise((resolve, reject) => {
            if (window.JSZip) return resolve(window.JSZip);
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
            script.onload = () => resolve(window.JSZip);
            script.onerror = () => reject(new Error('Impossible de charger JSZip'));
            document.head.appendChild(script);
        });
    }

    const button = document.createElement('button');
    button.textContent = 'Télécharger photos ZIP';
    button.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 10000;
        padding: 10px 15px;
        background-color: #4caf50;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 14px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    `;
    document.body.appendChild(button);

    function tryParseJSON(text) {
        try {
            return JSON.parse(text);
        } catch(e) {
            return null;
        }
    }

    function findObjectWithPhotos(obj) {
        if (!obj || typeof obj !== 'object') return null;
        if (Array.isArray(obj)) {
            for (const item of obj) {
                const res = findObjectWithPhotos(item);
                if (res) return res;
            }
        } else {
            if (obj.photos && Array.isArray(obj.photos) && obj.photos.length > 0) {
                return obj;
            }
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    const res = findObjectWithPhotos(obj[key]);
                    if (res) return res;
                }
            }
        }
        return null;
    }

    function extractDataFromScripts() {
        const scripts = Array.from(document.querySelectorAll('script'));
        for (const script of scripts) {
            const m = script.textContent.match(/self\.__next_f\.push\((.*?)\);?/s);
            if (!m) continue;
            let jsonStr = m[1];
            let arr = tryParseJSON(jsonStr);
            if (!arr) continue;

            for (const item of arr) {
                if (typeof item === 'string') {
                    const idx = item.search(/[\[\{]/);
                    if (idx === -1) continue;
                    const cleaned = item.slice(idx);
                    const parsed = tryParseJSON(cleaned);
                    if (!parsed) continue;
                    const found = findObjectWithPhotos(parsed);
                    if (found) return found;
                } else if (typeof item === 'object') {
                    const found = findObjectWithPhotos(item);
                    if (found) return found;
                }
            }
        }
        return null;
    }

    async function fetchImageAsBlob(url) {
        const resp = await fetch(url);
        if (!resp.ok) throw new Error(`Erreur fetch image: ${url}`);
        return await resp.blob();
    }

    async function downloadZip(item) {
        const JSZip = await loadJSZip();
        const zip = new JSZip();
        const folderName = (item.title || 'vinted_photos').replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const folder = zip.folder(folderName) || zip;

        const photos = item.photos || [];
        if (photos.length === 0) {
            alert("Aucune photo trouvée pour cette annonce.");
            return;
        }

        button.disabled = true;
        button.textContent = 'Téléchargement en cours...';

        try {
            for (let i = 0; i < photos.length; i++) {
                const url = photos[i].full_size_url || photos[i].url;
                if (!url) continue;
                const blob = await fetchImageAsBlob(url);
                folder.file(`${folderName}_photo_${i + 1}.webp`, blob);
            }
            const content = await zip.generateAsync({type:"blob"});
            const a = document.createElement('a');
            a.href = URL.createObjectURL(content);
            a.download = `${folderName}.zip`;
            a.click();
            URL.revokeObjectURL(a.href);
            alert(`Téléchargement zip lancé avec ${photos.length} photo(s).`);
        } catch(e) {
            alert(`Erreur lors du téléchargement : ${e.message}`);
            console.error(e);
        } finally {
            button.disabled = false;
            button.textContent = 'Télécharger photos ZIP';
        }
    }

    button.addEventListener('click', () => {
        const item = extractDataFromScripts();
        if (!item) {
            alert("Impossible d'extraire les détails de l'annonce.");
            return;
        }
        downloadZip(item);
    });
})();