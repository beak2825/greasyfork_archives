// ==UserScript==
// @name        Bypass DeviantArt Age Verification
// @namespace   http://tampermonkey.net/
// @version     1.1
// @description Bypasses DeviantArt Age Verification
// @author      urm0m
// @match       https://www.deviantart.com/*
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/560465/Bypass%20DeviantArt%20Age%20Verification.user.js
// @updateURL https://update.greasyfork.org/scripts/560465/Bypass%20DeviantArt%20Age%20Verification.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const MAX_RETRIES = 3;
    const RETRY_DELAY = 1500;

    // --- Part 1: Main artwork thumbnail (div.rdKaY6) ---
    function fetchMainThumbnail(attempt = 1) {
        const currentUrl = window.location.href.split('#')[0];
        const apiUrl = `https://backend.deviantart.com/oembed?url=${encodeURIComponent(currentUrl)}&format=json`;

        GM_xmlhttpRequest({
            method: 'GET',
            url: apiUrl,
            timeout: 10000,
            onload: function(response) {
                if (response.status !== 200) {
                    console.warn(`Main oEmbed HTTP ${response.status} (attempt ${attempt})`);
                    retryMain(attempt);
                    return;
                }
                try {
                    const data = JSON.parse(response.responseText);
                    if (!data?.thumbnail_url) throw new Error("No thumbnail_url");

                    const div = document.querySelector('div.rdKaY6');
                    if (div) {
                        div.innerHTML = `<img src="${data.thumbnail_url}" alt="Artwork Thumbnail" style="max-width:100%; height:auto; display:block; border-radius:8px;">`;
                    }
                } catch (error) {
                    console.warn(`Main JSON error (attempt ${attempt})`);
                    retryMain(attempt);
                }
            },
            onerror: () => retryMain(attempt),
            ontimeout: () => retryMain(attempt)
        });
    }

    function retryMain(attempt) {
        if (attempt < MAX_RETRIES) setTimeout(() => fetchMainThumbnail(attempt + 1), RETRY_DELAY);
    }

    // --- Part 2: Replace embedded art preview divs (class "Hw5CoU dwd9jn") ---
    function replaceEmbeddedPreviews() {
        const previews = document.querySelectorAll('div.Hw5CoU.dwd9jn');

        previews.forEach(div => {
            // Find the <a> tag inside the div
            const link = div.querySelector('a');
            if (!link || !link.href) return;

            const targetUrl = link.href;

            // Skip if already replaced
            if (div.dataset.replaced === 'true') return;

            const apiUrl = `https://backend.deviantart.com/oembed?url=${encodeURIComponent(targetUrl)}&format=json`;

            GM_xmlhttpRequest({
                method: 'GET',
                url: apiUrl,
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data?.thumbnail_url) {
                            // Create new image wrapped in the original link
                            const newImg = document.createElement('img');
                            newImg.src = data.thumbnail_url;
                            newImg.alt = data.title || 'Embedded artwork';
                            newImg.style.cssText = 'max-width:100%; height:auto; display:block; border-radius:8px;';

                            // Wrap image in the original <a> (preserve navigation)
                            const newLink = document.createElement('a');
                            newLink.href = targetUrl;
                            newLink.appendChild(newImg);

                            // Replace the entire div with the new linked image
                            div.parentNode.replaceChild(newLink, div);

                            console.log(`Replaced embedded preview with real thumbnail: ${targetUrl}`);
                        }
                    } catch (e) {
                        console.warn('Failed to parse oEmbed for embedded art:', targetUrl);
                    }
                },
                onerror: () => console.warn('oEmbed request failed for:', targetUrl)
            });

            // Mark as processed to avoid duplicate requests
            div.dataset.replaced = 'true';
        });
    }

    // --- Part 3: Button enhancements (unchanged from v0.8) ---
    function enhanceButtonsAndAddClickHandler() {
        const container = document.querySelector('div.tax0xe');
        if (!container) return;

        const buttons = container.querySelectorAll('button.HRaKHz');

        buttons.forEach((button, index) => {
            if (button.hasAttribute('disabled')) button.removeAttribute('disabled');
            if (button.getAttribute('aria-disabled') !== 'false') {
                button.setAttribute('aria-disabled', 'false');
            }
            const img = button.querySelector('img.aNxbc5');
            if (img) img.classList.remove('aNxbc5');

            button.removeEventListener('click', buttonClickHandler);
            button.dataset.imageIndex = index + 1;
            button.addEventListener('click', buttonClickHandler);
        });
    }

    function buttonClickHandler(event) {
        event.preventDefault();
        event.stopPropagation();

        const clickedButton = event.currentTarget;
        const container = document.querySelector('div.tax0xe');
        if (!container) return;

        const allButtons = container.querySelectorAll('button.HRaKHz');
        const index = Array.from(allButtons).indexOf(clickedButton);
        const imageNumber = index + 1;

        allButtons.forEach((btn, i) => {
            btn.classList.toggle('eJQ106', i === index);
        });

        const newUrl = window.location.pathname + window.location.search + `#image-${imageNumber}`;
        if (window.location.href !== newUrl) {
            window.location.href = newUrl;
        } else {
            window.location.reload();
        }
    }

    function highlightButtonFromHash() {
        if (!window.location.hash.startsWith('#image-')) return;
        const hashNum = parseInt(window.location.hash.replace('#image-', ''), 10);
        if (isNaN(hashNum)) return;

        const container = document.querySelector('div.tax0xe');
        if (!container) return;

        const buttons = container.querySelectorAll('button.HRaKHz');
        const targetIndex = hashNum - 1;
        if (targetIndex >= 0 && targetIndex < buttons.length) {
            buttons.forEach((btn, i) => {
                btn.classList.toggle('eJQ106', i === targetIndex);
            });
        }
    }

    // --- Initialization ---
    function init() {
        if (document.querySelector('div.rdKaY6')) fetchMainThumbnail();
        replaceEmbeddedPreviews();
        enhanceButtonsAndAddClickHandler();
        highlightButtonFromHash();

        const observer = new MutationObserver(() => {
            if (!document.querySelector('div.rdKaY6 img') && document.querySelector('div.rdKaY6')) {
                fetchMainThumbnail();
            }
            replaceEmbeddedPreviews();
            enhanceButtonsAndAddClickHandler();
            highlightButtonFromHash();
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    if (document.readyState === 'complete') {
        setTimeout(init, 800);
    } else {
        window.addEventListener('load', () => setTimeout(init, 800));
    }

})();