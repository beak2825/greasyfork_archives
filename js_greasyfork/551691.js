// ==UserScript==
// @name         NihalHosting🐸
// @version      1.2
// @description  Upload images to shoutbox via timepass.fpureit.top🫡 + Drag & Drop.
// @author       Sumbul⚡
// @match        https://*.torrentbd.com/*
// @match        https://*.torrentbd.net/*
// @match        https://*.torrentbd.org/*
// @match        https://*.torrentbd.me/*
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @namespace ‎
// @downloadURL https://update.greasyfork.org/scripts/551691/NihalHosting%F0%9F%90%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/551691/NihalHosting%F0%9F%90%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const ENDPOINTS = [
        'https://timepass.fpureit.top/upload.php',
        'https://timepass.fpureit.top/index.php',
        'https://timepass.fpureit.top/'
    ];

    const INPUT = '#shout_text';
    const TRAY = '#shout-ibb-container';

    function init() {
        const input = document.querySelector(INPUT);
        const tray = document.querySelector(TRAY);
        if (!input || !tray || document.getElementById('imgbd-uploader-btn')) return false;

        const upload = (file, i = 0, original = input.value) => {
            if (i >= ENDPOINTS.length) {
                input.value = '[Upload failed]';
                setTimeout(() => input.value = original, 2500);
                input.disabled = false;
                return;
            }

            const fd = new FormData();
            fd.append('file', file);

            GM_xmlhttpRequest({
                method: 'POST',
                url: ENDPOINTS[i],
                data: fd,
                onload: res => {
                    if (res.status === 200) {
                        const match = res.responseText.match(/https?:\/\/timepass\.fpureit\.top\/[a-zA-Z0-9]+\.(png|jpe?g|gif|webp)/i);
                        if (match) {
                            input.value = (original ? original + ' ' : '') + match[0] + ' ';
                            input.disabled = false;
                            input.focus();
                            return;
                        }
                    }
                    upload(file, i + 1, original);
                },
                onerror: () => upload(file, i + 1, original)
            });
        };

        const startUpload = (file) => {
            const original = input.value.replace(/\[Uploading.*?\]/, '').trim();
            input.value = '[Uploading...]';
            input.disabled = true;
            upload(file, 0, original);
        };

        input.addEventListener('paste', e => {
            const file = [...(e.clipboardData || e.originalEvent.clipboardData).items]
                .find(i => i.type.startsWith('image/'))?.getAsFile();
            if (file) {
                e.preventDefault();
                startUpload(file);
            }
        });

        input.addEventListener('dragover', e => {
            e.preventDefault();
            input.style.border = '2px dashed #4cafef';
        });

        input.addEventListener('dragleave', e => {
            e.preventDefault();
            input.style.border = '';
        });

        input.addEventListener('drop', e => {
            e.preventDefault();
            input.style.border = '';
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                startUpload(file);
            }
        });

        const picker = Object.assign(document.createElement('input'), {
            type: 'file',
            accept: 'image/*',
            style: 'display:none'
        });
        document.body.appendChild(picker);
        picker.addEventListener('change', e => {
            if (e.target.files[0]) startUpload(e.target.files[0]);
            picker.value = null;
        });

        const btn = document.createElement('span');
        btn.id = 'imgbd-uploader-btn';
        btn.className = 'inline-submit-btn';
        btn.title = 'Upload Image';
        btn.innerHTML = '<i class="material-icons">add_photo_alternate</i>';
        btn.style.cursor = 'pointer';
        btn.addEventListener('click', () => picker.click());
        tray.insertBefore(btn, tray.querySelector('#urlBtn') || null);

        return true;
    }

    let tries = 0;
    const int = setInterval(() => {
        if (init() || ++tries > 60) clearInterval(int);
    }, 250);
})();