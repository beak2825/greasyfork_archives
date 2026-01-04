// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      2025-11-27-00:28
// @description  try to take over the world
// @author       You
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bing.com
// @grant        none
// @run-at document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557703/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/557703/New%20Userscript.meta.js
// ==/UserScript==
let style = document.createElement("style")
style.innerHTML = `div.msg-list{opacity: 0.5;}`
document.head.appendChild(style)
let button = document.createElement("button");
button.style.position = "absolute";
button.style.top = "10vh";
button.style.left = "0";
button.innerText = "Change Background";

button.addEventListener("click", () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*,video/*,image/gif';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);

    fileInput.addEventListener('change', function() {
        const file = this.files[0];
        if (!file) return;

        const fileUrl = URL.createObjectURL(file);
        const chatDiv = document.body.querySelector('div.chat');

        if (!chatDiv) {
            console.log("Chat div not found");
            return;
        }

        // Check if it's a video
        if (file.type.startsWith('video/')) {
            // Remove any existing background image
            chatDiv.style.backgroundImage = 'none';

            // Remove existing video if present
            const existingVideo = chatDiv.querySelector('.background-video');
            if (existingVideo) {
                existingVideo.remove();
            }

            // Create video element
            const video = document.createElement('video');
            video.src = fileUrl;
            video.autoplay = true;
            video.loop = true;
            video.muted = true;
            video.playsInline = true;
            video.style.position = 'absolute';
            video.style.top = '0';
            video.style.left = '0';
            video.style.width = '100%';
            video.style.height = '100%';
            video.style.objectFit = 'cover';
            video.style.zIndex = '0';
            video.classList.add('background-video');

            // Make sure chat div has relative positioning for video to work
            chatDiv.style.position = 'relative';
            chatDiv.style.overflow = 'hidden';

            // Insert video at the beginning of chat div
            chatDiv.insertBefore(video, chatDiv.firstChild);

        } else {
            // For images and gifs, use backgroundImage
            // Remove any existing video
            const existingVideo = chatDiv.querySelector('.background-video');
            if (existingVideo) {
                existingVideo.remove();
            }

            chatDiv.style.backgroundImage = `url("${fileUrl}")`;
            chatDiv.style.backgroundSize = 'cover';
            chatDiv.style.backgroundPosition = 'center';
            chatDiv.style.backgroundRepeat = 'no-repeat';
        }

        // Clean up file input
        fileInput.remove();
    });

    fileInput.click();
});

document.body.appendChild(button);