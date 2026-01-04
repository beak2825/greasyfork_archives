// ==UserScript==
// @name         Shoutbox Image Uploader
// @version      7.0
// @description  Upload images to the shoutbox by pasting or selecting a file (via Litterbox.catbox.moe - temporary hosting)
// @author       Sumbul⚡
// @match        https://*.torrentbd.com/*
// @match        https://*.torrentbd.net/*
// @match        https://*.torrentbd.org/*
// @match        https://*.torrentbd.me/*
// @icon         https://s14.gifyu.com/images/bT3Pc.png
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @namespace https://greasyfork.org/users/1511401
// @downloadURL https://update.greasyfork.org/scripts/548225/Shoutbox%20Image%20Uploader.user.js
// @updateURL https://update.greasyfork.org/scripts/548225/Shoutbox%20Image%20Uploader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const UPLOAD_API_URL = 'https://litterbox.catbox.moe/resources/internals/api.php';
    const EXPIRY = '24h'; // change to "1h", "12h", "72h" if needed
    const SHOUTBOX_INPUT_SELECTOR = '#shout_text';
    const SHOUTBOX_TRAY_SELECTOR = '#shout-ibb-container';

    function initializeUploader() {
        const shoutInput = document.querySelector(SHOUTBOX_INPUT_SELECTOR);
        const shoutTray = document.querySelector(SHOUTBOX_TRAY_SELECTOR);
        if (!shoutInput || !shoutTray || document.getElementById('tbd-uploader-button')) {
            return false;
        }

        const uploadImage = (imageFile, fileName) => {
            const originalText = shoutInput.value;
            shoutInput.value = '[Uploading to Litterbox...]';
            shoutInput.disabled = true;

            const formData = new FormData();
            formData.append('reqtype', 'fileupload');
            formData.append('time', EXPIRY);
            formData.append('fileToUpload', imageFile, fileName);

            GM_xmlhttpRequest({
                method: 'POST',
                url: UPLOAD_API_URL,
                data: formData,
                onload: (response) => {
                    try {
                        if (response.status !== 200) throw new Error(`HTTP Status ${response.status}`);
                        const imageUrl = response.responseText.trim();
                        if (!imageUrl.startsWith('http')) throw new Error(`API returned an error: ${imageUrl}`);
                        shoutInput.value = originalText + imageUrl + ' ';
                    } catch (e) {
                        shoutInput.value = `[Upload failed! ${e.message}]`;
                        setTimeout(() => { shoutInput.value = originalText; }, 3000);
                    } finally {
                        shoutInput.disabled = false;
                        shoutInput.focus();
                    }
                },
                onerror: () => {
                    shoutInput.value = `[Upload failed! Network error.]`;
                    setTimeout(() => { shoutInput.value = originalText; }, 3000);
                    shoutInput.disabled = false;
                    shoutInput.focus();
                }
            });
        };

        const handlePaste = (event) => {
            const items = (event.clipboardData || event.originalEvent.clipboardData).items;
            const imageFile = [...items].find(item => item.type.startsWith('image/'))?.getAsFile();
            if (imageFile) {
                event.preventDefault();
                uploadImage(imageFile, 'pasted_image.png');
            }
        };
        shoutInput.addEventListener('paste', handlePaste);

        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';
        document.body.appendChild(fileInput);

        fileInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                uploadImage(file, file.name);
            }
            event.target.value = null;
        });

        const uploaderButton = document.createElement('span');
        uploaderButton.id = 'tbd-uploader-button';
        uploaderButton.className = 'inline-submit-btn';
        uploaderButton.title = 'Upload Image from File';
        uploaderButton.innerHTML = '<i class="material-icons">add_photo_alternate</i>';
        uploaderButton.style.cursor = 'pointer';
        uploaderButton.addEventListener('click', () => fileInput.click());

        const urlButton = shoutTray.querySelector('#urlBtn');
        shoutTray.insertBefore(uploaderButton, urlButton || null);

        return true;
    }

    let attempts = 0;
    const interval = setInterval(() => {
        if (initializeUploader() || ++attempts > 60) {
            clearInterval(interval);
        }
    }, 250);

})();
