// ==UserScript==
// @name         Arca.live Metadata Checker
// @name:ko      Arca.live 메타데이터 검사기
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Visually marks images on web pages that contain ComfyUI workflow metadata.
// @description:ko 웹페이지의 이미지에 ComfyUI 워크플로우 데이터가 있는지 시각적으로 표시합니다.
// @author       Your Name
// @match        https://arca.live/b/*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/558224/Arcalive%20Metadata%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/558224/Arcalive%20Metadata%20Checker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle('.comfyui-workflow-exists { border: 3px solid #4CAF50 !important; }');
    GM_addStyle('.comfyui-workflow-exists:hover { box-shadow: 0 0 10px #4CAF50; }');

    function containsComfyUIText(arrayBuffer) {
        const text = new TextDecoder("utf-8", { fatal: false }).decode(arrayBuffer);
        return text.includes('prompt') || text.includes('workflow');
    }
    function checkAllImages() {
        const images = document.querySelectorAll('img:not(.comfy-checked)');
        images.forEach(img => {
            img.classList.add('comfy-checked');
            const imageUrl = img.src;
            if (!imageUrl || !imageUrl.startsWith('http')) {
                return;
            }
            GM_xmlhttpRequest({
                method: 'GET',
                url: imageUrl,
                responseType: 'arraybuffer',
                onload: function(response) {
                    if (response.status === 200) {
                        if (containsComfyUIText(response.response)) {
                            console.log('ComfyUI metadata found:', imageUrl);
                            img.classList.add('comfyui-workflow-exists');
                        }
                    }
                },
                onerror: function(response) {
                }
            });
        });
    }
    checkAllImages();

    const observer = new MutationObserver(checkAllImages);
    observer.observe(document.body, { childList: true, subtree: true });

})();