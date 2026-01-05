// ==UserScript==
// @name         Doujins.com - Infinite Scroll
// @version      1.0.2
// @description  Creates an 'Infinite Scroll' button. Clicking it will let you do infinite scrolling with high resolution images.
// @author       makewebsitesbetter
// @namespace    userscripts
// @icon         https://i.postimg.cc/3NMLffrh/greenbox.png
// @include      /^https?:\/\/.*doujins\.com\/(?!tags\/)[^\/]+\/.*-\d+(#.*)?$/
// @run-at       document-end
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558963/Doujinscom%20-%20Infinite%20Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/558963/Doujinscom%20-%20Infinite%20Scroll.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const BUTTON_ID = 'dj-fullwidth-btn';

    // 1. Creates an 'INFINITE SCROLL' button that is red and on the bottom right of the page.
    function createButton() {
        if (document.getElementById(BUTTON_ID)) return;

        const btn = document.createElement('button');
        btn.id = BUTTON_ID;
        btn.innerText = 'INFINITE SCROLL';
        btn.style.cssText = `
            position: fixed !important;
            bottom: 20px !important;
            right: 20px !important;
            z-index: 2147483647 !important;
            background-color: #ff0000 !important;
            color: #ffffff !important;
            border: 2px solid white !important;
            border-radius: 8px !important;
            padding: 15px 25px !important;
            font-size: 16px !important;
            font-weight: bold !important;
            cursor: pointer !important;
            box-shadow: 0 0 10px rgba(0,0,0,0.5) !important;
        `;
        
        btn.onclick = activateFullWidth;
        document.body.appendChild(btn);
    }

    // 2. This is the main logic to transform the page.
    function activateFullWidth() {
        console.log("Activating Infinite Scroll Mode...");

        const btn = document.getElementById(BUTTON_ID);
        btn.innerText = 'Loading Images...';
        btn.style.backgroundColor = '#333';

        // A. Hide the thumbnail grid.
        const thumbGrid = document.getElementById('thumbnails');
        if (thumbGrid) thumbGrid.style.display = 'none';

        // B. Unhide the high-res container.
        const imagesContainer = document.getElementById('images');
        if (imagesContainer) {
            imagesContainer.classList.remove('hidden');
            imagesContainer.style.display = 'block';
            imagesContainer.style.height = 'auto'; // Override existing inline height
        }

        // C. Process every image.
        processImages();
        
        // D. Watch for the "Load More" button.
        const observer = new MutationObserver(processImages);
        if (imagesContainer) {
            observer.observe(imagesContainer, { childList: true, subtree: true });
        }

        btn.innerText = 'SCROLL MODE ACTIVE';
        // Hide the button after 2 seconds so it doesn't block the view.
        setTimeout(() => { btn.style.display = 'none'; }, 2000);
    }

    function processImages() {
        // Select all images inside the #images div.
        const images = document.querySelectorAll('#images img.doujin');

        images.forEach(img => {
            // 1. Ensure the SRC is set to the high-res file.
            const highRes = img.getAttribute('data-file');
            if (highRes && img.src !== highRes) {
                img.src = highRes;
            }

            // 2. Remove the "hidden" class.
            img.classList.remove('hidden');

            // 3. Force styles to override the slideshow's absolute positioning, transform, and opacity:0.
            img.style.cssText = `
                display: block !important;
                position: static !important;
                width: 100% !important;
                height: auto !important;
                opacity: 1 !important;
                visibility: visible !important;
                transform: none !important;
                margin-bottom: 10px !important;
                transition: none !important;
                max-width: 100% !important;
            `;
            
            // 4. Ensure loading is lazy to save bandwidth.
            img.loading = "lazy";
        });
    }

    // Run the button creation logic immediately.
    createButton();

    // Also try running it again after window load in case strict mode blocked it.
    window.addEventListener('load', createButton);

})();