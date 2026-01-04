// ==UserScript==
// @name         Pooiod7 Extension Gallery (for PenguinMod)
// @namespace    https://p7scratchextensions.pages.dev/
// @version      2025-12-01
// @description  Adds all my extension to the PM gallery, and and a button to open my extension site. Also auto-approves my extensions when added.
// @author       pooiod7
// @match        https://studio.penguinmod.com/*
// @icon         https://p7scratchextensions.pages.dev/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557729/Pooiod7%20Extension%20Gallery%20%28for%20PenguinMod%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557729/Pooiod7%20Extension%20Gallery%20%28for%20PenguinMod%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function checkAndInsertExtensionGallery() {
        const targetSpan = Array.from(document.querySelectorAll('span'))
        .find(span => span.textContent.trim() === 'PenguinMod Extra Extensions');

        if (document.querySelector('#p7extensionslist')) {
            document.querySelector('#p7extensionslist').remove();
        }

        if (targetSpan && Array.from(document.querySelectorAll('span'))
            .find(span => span.textContent.trim() === 'TurboWarp Extension Gallery')) {
            const parentElement = targetSpan.closest('span').parentElement.parentElement;

            const newHTML = `
<div id="p7extensionslist" class="library-item_library-item_1DcMO library-item_featured-item_3V2-t library-item_library-item-extension_3xus9" onclick="window.open('https://p7scratchextensions.pages.dev')">
  <div class="library-item_featured-image-container_1KIHG">
    <img class="library-item_featured-image_2gwZ6" loading="lazy" draggable="false" src="https://p7scratchextensions.pages.dev/extras/images/P7ExtGalleryCover.png">
  </div>
  <div class="library-item_featured-extension-text_22A1k library-item_featured-text_2KFel">
    <span class="library-item_library-item-name_2qMXu"><span>Pooiod7's extensions</span></span><br>
    <span class="library-item_featured-description_MjIJw"><span>Explore a large collection of Scratch extensions made by Pooiod7.</span></span>
  </div>
</div>
`;

            parentElement.insertAdjacentHTML('afterend', newHTML);
        }
    }

    setInterval(checkAndInsertExtensionGallery, 1000);

    let checks = 0;
    let clicks = 0;
    let interval = setInterval(() => {
        if (checks >= 1000) {
            clearInterval(interval);
            return;
        }

        let targetElement = document.querySelector('p.url_url_3Y61f');
        if (targetElement && (targetElement.textContent.includes('https://p7scratchextensions.pages.dev/') || targetElement.textContent.includes('https://p7extensions.pages.dev/'))) {
            let button = document.querySelector('button.security-manager-modal_allow-button_3tcXk');
            if (button) {
                if (button.disabled) button.disabled = false;
                button.click();
                clicks++;

                if (!document.body.contains(targetElement) || clicks >= 10) {
                    clearInterval(interval);
                }
            }
        }
        checks++;
    }, 100);


    fetch('https://p7scratchextensions.pages.dev/extensions.json')
        .then(res => {
        if (!res.ok) throw new Error("Could not fetch extension list");
        return res.json();
    })
        .then(async (data) => {
        const baseUrl = 'https://p7scratchextensions.pages.dev';

        const visibleExtensions = data.filter(item => item.hidden !== true);

        const processedExtensions = await Promise.all(visibleExtensions.map(async (item) => {

            const mainUrl = `${baseUrl}/ext/${item.id}/main.js`;
            const devUrl = `${baseUrl}/ext/${item.id}/dev.js`;

            let validScriptUrl = mainUrl;

            try {
                const check = await fetch(mainUrl, { method: 'HEAD' });
                if (!check.ok) {
                    validScriptUrl = devUrl;
                }
            } catch (e) {
                validScriptUrl = devUrl;
            }

            let relativeImgPath = item.image.replace('[id]', item.id);
            if (relativeImgPath.startsWith('/')) relativeImgPath = relativeImgPath.slice(1);

            const finalImageUrl = `${baseUrl}/${relativeImgPath}`;

            function htmlToText(str) {
                const doc = new DOMParser().parseFromString(str, "text/html");
                return doc.body.textContent || "";
            }

            return {
                "deletable": true,
                "description": htmlToText(item.description),
                "extensionId": validScriptUrl,
                "featured": true,
                "name": item.title,
                "rawURL": finalImageUrl,
                "tags": ["pooiod7"],
                "_id": Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
                "_unsandboxed": item.unsandboxed
            };
        }));

        return processedExtensions;
    })
        .then((newExtensions) => {
        const request = indexedDB.open('localforage');

        request.onupgradeneeded = function(event) {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('keyvaluepairs')) {
                db.createObjectStore('keyvaluepairs');
            }
        };

        request.onsuccess = function(event) {
            const db = event.target.result;
            const transaction = db.transaction('keyvaluepairs', 'readwrite');
            const store = transaction.objectStore('keyvaluepairs');

            const getRequest = store.get('pm:favorited_extensions');

            getRequest.onsuccess = function() {
                let favorites = getRequest.result || [];
                if (!Array.isArray(favorites)) favorites = [];

                let addedCount = 0;
                let updatedCount = 0;

                newExtensions.forEach(newExt => {
                    const existingIndex = favorites.findIndex(fav => fav.name === newExt.name);

                    if (existingIndex !== -1) {
                        newExt._id = favorites[existingIndex]._id;
                        favorites[existingIndex] = newExt;
                        updatedCount++;
                    } else {
                        favorites.push(newExt);
                        addedCount++;
                    }
                });

                store.put(favorites, 'pm:favorited_extensions');

                transaction.oncomplete = () => {
                    console.log(`Added ${addedCount} new extensions and updated ${updatedCount} existing ones.`);
                };
            };

            transaction.onerror = e => alert('Transaction failed: ' + e.target.error);
        };

        request.onerror = function(event) {
            alert('Could not open database: ' + event.target.error);
        };
    })
        .catch(err => alert('Error: ' + err));
})();