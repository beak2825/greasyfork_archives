// ==UserScript==
// @name         Remove disablePictureInPicture
// @namespace    https://greasyfork.org/nl/users/1197317-opus-x
// @version      1.01
// @description  Removes the disablePictureInPicture attribute to enable Picture-in-Picture on all videos. Ensures the native PiP button is visible where possible.
// @description:zh-CN 移除 disablePictureInPicture 属性，使所有视频支持画中画。尽量确保原生画中画按钮可见。
// @description:hi    disablePictureInPicture विशेषता हटाता है ताकि सभी वीडियो पर पिक्चर-इन-पिक्चर सक्षम हो। जहां संभव हो मूल PiP बटन दिखाई दे।
// @description:es    Elimina el atributo disablePictureInPicture para habilitar Picture-in-Picture en todos los videos. Asegura que el botón nativo PiP sea visible cuando sea posible.
// @description:fr    Supprime l'attribut disablePictureInPicture pour activer Picture-in-Picture sur toutes les vidéos. Assure la visibilité du bouton PiP natif lorsque possible.
// @description:ar    يزيل سمة disablePictureInPicture لتمكين صورة داخل صورة على جميع الفيديوهات. يضمن ظهور زر PiP الأصلي حيثما أمكن.
// @description:bn    disablePictureInPicture অ্যাট্রিবিউট সরিয়ে সব ভিডিওতে পিকচার-ইন-পিকচার সক্ষম করে। যেখানে সম্ভব নেটিভ PiP বোতাম দৃশ্যমান রাখে।
// @description:ru    Удаляет атрибут disablePictureInPicture для включения картинки в картинке на всех видео. Обеспечивает видимость нативной кнопки PiP где возможно.
// @description:pt    Remove o atributo disablePictureInPicture para ativar Picture-in-Picture em todos os vídeos. Garante que o botão nativo PiP fique visível quando possível.
// @description:nl    Verwijdert het disablePictureInPicture-attribuut zodat Picture-in-Picture altijd mogelijk is op video's. Zorgt ervoor dat de native PiP-knop zichtbaar is waar mogelijk.
// @author       Opus-X
// @icon         data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHJ4PSIxMiIgZmlsbD0iIzMzMzMzMyIvPgogIDxyZWN0IHg9IjYiIHk9IjYiIHdpZHRoPSI1MiIgaGVpZ2h0PSIzOSIgcng9IjYiIGZpbGw9IiMyMjIyMjIiIHN0cm9rZT0iIzU1NTU1NSIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzYsMjgpIj4KICAgIDxyZWN0IHdpZHRoPSIyNCIgaGVpZ2h0PSIxOCIgcng9IjQiIGZpbGw9IiMyMjIyMjIiIHN0cm9rZT0iI2FhYWFhYSIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgICA8cG9seWdvbiBwb2ludHM9IjgsNSA4LDEzIDE0LDkiIGZpbGw9IiNjY2NjY2MiLz4KICA8L2c+Cjwvc3ZnPg==
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559690/Remove%20disablePictureInPicture.user.js
// @updateURL https://update.greasyfork.org/scripts/559690/Remove%20disablePictureInPicture.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // MutationObserver to catch new video elements (including dynamically loaded ones in SPAs)
    const observer = new MutationObserver((mutations) => {
        let hasVideo = false;

        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeName === 'VIDEO') {
                    hasVideo = true;
                    enhanceVideo(node);
                }
            });
        });

        if (hasVideo) {
            document.querySelectorAll('video').forEach(enhanceVideo);
        }
    });

    // Main function to enhance each video element
    function enhanceVideo(video) {
        if (!video) return;

        // Remove disablePictureInPicture (both property and attribute)
        video.disablePictureInPicture = false;
        video.removeAttribute('disablePictureInPicture');

        // Ensure standard controls are enabled (this often reveals the native PiP button in Chrome/Edge)
        video.controls = true;

        // Optional: Remove controlsList restrictions that might hide buttons (e.g., download)
        if (video.controlsList) {
            video.controlsList.remove('nodownload');
            // Note: There is no standard 'nopip' in controlsList; PiP button visibility is browser-dependent
        }
    }

    // Initial scan and observer startup
    function start() {
        if (document.querySelector('video')) {
            document.querySelectorAll('video').forEach(enhanceVideo);
        }

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
            attributes: false
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();