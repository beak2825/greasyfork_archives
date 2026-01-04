// ==UserScript==
// @name         Shoutbox Image Uploader with DRAG&DROP&LABEL
// @version      1
// @description  Upload images to shoutbox by BOMBASTIC
// @author       BOMBASTIC
// @match        https://*.torrentbd.com/*
// @match        https://*.torrentbd.net/*
// @match        https://*.torrentbd.org/*
// @match        https://*.torrentbd.me/*
// @grant        GM_xmlhttpRequest
// @connect      catbox.moe
// @run-at       document-end
// @namespace    https://greasyfork.org/users/1512130
// @downloadURL https://update.greasyfork.org/scripts/548470/Shoutbox%20Image%20Uploader%20with%20DRAGDROPLABEL.user.js
// @updateURL https://update.greasyfork.org/scripts/548470/Shoutbox%20Image%20Uploader%20with%20DRAGDROPLABEL.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const UPLOAD_API_URL = 'https://catbox.moe/user/api.php';
    const SHOUTBOX_INPUT_SELECTOR = '#shout_text';
    const SHOUTBOX_TRAY_SELECTOR  = '#shout-ibb-container';

    function initializeUploader() {
        const shoutInput = document.querySelector(SHOUTBOX_INPUT_SELECTOR);
        const shoutTray  = document.querySelector(SHOUTBOX_TRAY_SELECTOR);
        if (!shoutInput || !shoutTray || document.getElementById('tbd-uploader-button')) return false;

        // Hidden file input
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';
        document.body.appendChild(fileInput);

        // Panel (hidden by default)
        const panel = document.createElement('div');
        panel.id = 'imagePanel';
        panel.style.position = 'absolute';
        panel.style.bottom = '45px';
        panel.style.right = '0';
        panel.style.width = '280px';
        panel.style.background = 'var(--main-bg)';
        panel.style.border = '1px solid var(--border-color)';
        panel.style.padding = '4px';
        panel.style.display = 'flex';
        panel.style.flexDirection = 'row';
        panel.style.alignItems = 'stretch';
        panel.style.gap = '4px';
        panel.style.zIndex = '9999';
        panel.style.height = 'auto';
        panel.style.visibility = 'hidden';

        // Label input
        const labelInput = document.createElement('input');
        labelInput.type = 'text';
        labelInput.placeholder = 'Label (optional)';
        labelInput.style.flex = '1';
        labelInput.style.padding = '0 6px';
        labelInput.style.margin = '0';
        labelInput.style.fontSize = '0.85rem';
        labelInput.style.lineHeight = '28px';
        labelInput.style.height = '28px';
        labelInput.style.border = '1px solid var(--border-color)';
        labelInput.style.borderRadius = '2px';
        labelInput.style.boxSizing = 'border-box';
        panel.appendChild(labelInput);

        // Upload button
        const uploadBtn = document.createElement('button');
        uploadBtn.textContent = 'Upload';
        uploadBtn.style.height = '28px';
        uploadBtn.style.padding = '0 8px';
        uploadBtn.style.margin = '0';
        uploadBtn.style.lineHeight = '28px';
        uploadBtn.style.flex = '0 0 auto';
        uploadBtn.style.cursor = 'pointer';
        uploadBtn.style.borderRadius = '2px';
        panel.appendChild(uploadBtn);

        // Insert button
        const insertBtn = document.createElement('button');
        insertBtn.textContent = 'Insert';
        insertBtn.style.height = '28px';
        insertBtn.style.padding = '0 8px';
        insertBtn.style.margin = '0';
        insertBtn.style.lineHeight = '28px';
        insertBtn.style.flex = '0 0 auto';
        insertBtn.style.cursor = 'pointer';
        insertBtn.style.borderRadius = '2px';
        panel.appendChild(insertBtn);

        shoutTray.appendChild(panel);

        // Image icon button
        const uploaderButton = document.createElement('span');
        uploaderButton.id = 'tbd-uploader-button';
        uploaderButton.className = 'inline-submit-btn';
        uploaderButton.title = 'Upload Image';
        uploaderButton.innerHTML = '<i class="material-icons">add_photo_alternate</i>';
        uploaderButton.style.cursor = 'pointer';

        // Insert before the URL button
        const urlButton = shoutTray.querySelector('#urlBtn');
        shoutTray.insertBefore(uploaderButton, urlButton || null);

        // Show/hide panel on click
        uploaderButton.addEventListener('click', () => {
            panel.style.visibility = panel.style.visibility === 'visible' ? 'hidden' : 'visible';
        });

        // Upload button triggers file input
        uploadBtn.addEventListener('click', () => {
            fileInput.click();
        });

        let lastUploadedUrl = '';

        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            uploadBtn.disabled = true;
            insertBtn.disabled = true;
            uploadImage(file);
            fileInput.value = null;
        });

        insertBtn.addEventListener('click', () => {
            if (!lastUploadedUrl) return;
            const label = labelInput.value.trim();
            if (label) {
                const urlRegex = new RegExp(`\\[url=${lastUploadedUrl}\\](.*?)\\[\\/url\\]|${lastUploadedUrl}`, 'g');
                shoutInput.value = shoutInput.value.replace(urlRegex, `[url=${lastUploadedUrl}]${label}[/url]`);
            }
            labelInput.value = '';
        });

        // Auto-upload image from clipboard
        shoutInput.addEventListener('paste', (event) => {
            const items = (event.clipboardData || event.originalEvent?.clipboardData)?.items || [];
            const file = [...items].find(i => i.type?.startsWith('image/'))?.getAsFile();
            if (file) {
                event.preventDefault();
                uploadBtn.disabled = true;
                insertBtn.disabled = true;
                uploadImage(file);
            }
        });

        // Drag & Drop upload
        shoutInput.addEventListener('dragover', (e) => {
            e.preventDefault();
            shoutInput.style.border = '2px dashed #4cafef';
        });

        shoutInput.addEventListener('dragleave', () => {
            shoutInput.style.border = '';
        });

        shoutInput.addEventListener('drop', (e) => {
            e.preventDefault();
            shoutInput.style.border = '';
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                uploadBtn.disabled = true;
                insertBtn.disabled = true;
                uploadImage(file);
            }
        });

        // ✅ Catbox Upload
        function uploadImage(file) {
            const originalText = shoutInput.value;
            shoutInput.disabled = true;

            const formData = new FormData();
            formData.append('reqtype', 'fileupload');
            formData.append('fileToUpload', file);

            let percent = 0;
            const interval = setInterval(() => {
                if (percent < 95) {
                    percent += Math.floor(Math.random() * 5) + 1;
                    shoutInput.value = `[Uploading ${percent}%…]`;
                }
            }, 500);

            GM_xmlhttpRequest({
                method: 'POST',
                url: UPLOAD_API_URL,
                data: formData,
                onload: (response) => {
                    clearInterval(interval);
                    try {
                        if (response.status !== 200) throw new Error(`HTTP ${response.status}`);
                        const imageUrl = response.responseText.trim(); // Catbox returns plain URL
                        if (!imageUrl.startsWith('http')) throw new Error('Invalid response from Catbox');

                        lastUploadedUrl = imageUrl;
                        shoutInput.value = originalText + imageUrl + ' ';
                    } catch (err) {
                        shoutInput.value = `[Upload failed! ${err.message}]`;
                        setTimeout(() => { shoutInput.value = originalText; }, 3000);
                    } finally {
                        shoutInput.disabled = false;
                        uploadBtn.disabled = false;
                        insertBtn.disabled = false;
                        shoutInput.focus();
                    }
                },
                onerror: () => {
                    clearInterval(interval);
                    shoutInput.value = '[Upload failed! Network error.]';
                    setTimeout(() => { shoutInput.value = originalText; }, 3000);
                    shoutInput.disabled = false;
                    uploadBtn.disabled = false;
                    insertBtn.disabled = false;
                    shoutInput.focus();
                }
            });
        }

        return true;
    }

    let attempts = 0;
    const interval = setInterval(() => {
        if (initializeUploader() || ++attempts > 60) clearInterval(interval);
    }, 250);

})();
