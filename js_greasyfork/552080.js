// ==UserScript==
// @name         AI Studio Watermark Blocker
// @namespace    https://github.com/Saganaki22/ai-studio-watermark-blocker
// @version      1.0.2
// @description  Blocks watermark requests in Google AI Studio to remove watermarks from generated images
// @author       Saganaki22
// @license      MIT
// @match        https://aistudio.google.com/*
// @run-at       document-start
// @grant        none
// @homepageURL  https://github.com/Saganaki22/ai-studio-watermark-blocker
// @supportURL   https://github.com/Saganaki22/ai-studio-watermark-blocker/issues
// @connect      none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/552080/AI%20Studio%20Watermark%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/552080/AI%20Studio%20Watermark%20Blocker.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const watermarkPatterns = ['watermark_v4.png', 'watermark_v5.png', 'watermark', 'synth', 'SynthID'];
    function isWatermarkUrl(url) {
        if (!url || typeof url !== 'string') return false;
        const urlLower = url.toLowerCase();
        return watermarkPatterns.some(function(pattern) {
            return urlLower.includes(pattern.toLowerCase());
        });
    }
    const originalXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
        if (isWatermarkUrl(url)) {
            console.log('[Watermark Blocker] Blocked XHR request:', url);
            return;
        }
        return originalXHROpen.call(this, method, url, async, user, password);
    };
    const originalFetch = window.fetch;
    window.fetch = function(url, options) {
        const urlString = url instanceof Request ? url.url : url;
        if (isWatermarkUrl(urlString)) {
            console.log('[Watermark Blocker] Blocked fetch request:', urlString);
            return Promise.reject(new Error('Watermark request blocked'));
        }
        const fetchPromise = originalFetch.call(this, url, options);
        fetchPromise.then(function(response) {
            if (response.url && isWatermarkUrl(response.url)) {
                console.log('[Watermark Blocker] Detected watermark in response:', response.url);
            }
        }).catch(function() {});
        return fetchPromise;
    };
    const originalImage = window.Image;
    window.Image = function() {
        const img = new originalImage();
        const originalSrcSetter = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src').set;
        Object.defineProperty(img, 'src', {
            set: function(value) {
                if (isWatermarkUrl(value)) {
                    console.log('[Watermark Blocker] Blocked image src:', value);
                    return;
                }
                return originalSrcSetter.call(this, value);
            },
            get: function() {
                return this.getAttribute('src');
            }
        });
        return img;
    };
    const originalGetContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function() {
        const args = Array.prototype.slice.call(arguments);
        const context = originalGetContext.apply(this, args);
        if (args[0] === '2d' && context) {
            const originalDrawImage = context.drawImage;
            context.drawImage = function(image) {
                const drawArgs = Array.prototype.slice.call(arguments, 1);
                const src = image.src || image.currentSrc || '';
                if (isWatermarkUrl(src)) {
                    console.log('[Watermark Blocker] Blocked canvas drawImage:', src);
                    return;
                }
                if (src.startsWith('blob:')) {
                    console.log('[Watermark Blocker] Canvas drawing blob URL:', src);
                }
                return originalDrawImage.apply(this, [image].concat(drawArgs));
            };
        }
        return context;
    };
    console.log('AI Studio Watermark Blocker loaded successfully');
    console.log('[Watermark Blocker] Blocking patterns:', watermarkPatterns);
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.tagName === 'IMG' && isWatermarkUrl(node.src)) {
                    console.log('[Watermark Blocker] Removed watermark img element:', node.src);
                    node.remove();
                }
            });
        });
    });
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
})();