// ==UserScript==
// @name         Torn Chat Image Uploader (ImgBB)
// @version      1.3
// @description  Upload images to ImgBB via Torn chat and paste link automatically
// @author       dingus [3188789]
// @match        https://www.torn.com/*
// @grant        GM_xmlhttpRequest
// @connect      api.imgbb.com
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/563848/Torn%20Chat%20Image%20Uploader%20%28ImgBB%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563848/Torn%20Chat%20Image%20Uploader%20%28ImgBB%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const IMGBB_API_KEY = '2d71dd2ec21a48c6e634aeb6ec0544dd';

    function uploadImage(file, chatInput) {
        const formData = new FormData();
        formData.append('image', file);

        const originalPlaceholder = chatInput.placeholder;
        chatInput.placeholder = "Uploading...";
        chatInput.disabled = true;

        GM_xmlhttpRequest({
            method: "POST",
            url: `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
            data: formData,
            onload: function(response) {
                const data = JSON.parse(response.responseText);
                if (data.success) {
                    const url = data.data.url;
                    const currentValue = chatInput.value;
                    chatInput.value = currentValue ? currentValue + " " + url : url;
                    chatInput.dispatchEvent(new Event('input', { bubbles: true }));
                    chatInput.focus();
                } else {
                    alert("Upload failed: " + data.error.message);
                }
                chatInput.placeholder = originalPlaceholder;
                chatInput.disabled = false;
            },
            onerror: function() {
                alert("Network error.");
                chatInput.placeholder = originalPlaceholder;
                chatInput.disabled = false;
            }
        });
    }

    function injectUploadButton() {
        const chatInputWrappers = document.querySelectorAll('div[class*="root___WUd1h"]');

        chatInputWrappers.forEach(wrapper => {
            if (wrapper.querySelector('.imgbb-native-trigger')) return;

            const chatInput = wrapper.querySelector('textarea');
            if (!chatInput) return;

            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';
            fileInput.style.display = 'none';
            fileInput.onchange = (e) => {
                if (e.target.files[0]) uploadImage(e.target.files[0], chatInput);
            };

            const uploadBtn = document.createElement('div');
            uploadBtn.className = 'imgbb-native-trigger';
            uploadBtn.title = 'Upload Image';

            uploadBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="16" height="16">
                    <path fill="currentColor" d="M149.1 64.8L138.7 96H64C28.7 96 0 124.7 0 160V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V160c0-35.3-28.7-64-64-64H373.3L362.9 64.8C356.4 45.2 338.1 32 317.4 32H194.6c-20.7 0-39 13.2-45.5 32.8zM256 192a96 96 0 1 1 0 192 96 96 0 1 1 0-192z"/>
                </svg>
            `;

            uploadBtn.style = `
                cursor: pointer;
                padding: 4px 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #aaa; /* Default Torn icon gray */
                transition: color 0.2s;
            `;

            uploadBtn.onmouseover = () => { uploadBtn.style.color = '#378ad3'; };
            uploadBtn.onmouseout = () => { uploadBtn.style.color = '#aaa'; };

            uploadBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                fileInput.click();
            };

            wrapper.prepend(fileInput);
            wrapper.prepend(uploadBtn);
        });
    }

    setInterval(injectUploadButton, 2000);
})();