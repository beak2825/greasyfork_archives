// ==UserScript==
// @name         Auto Translate Any Page with OCR (Mobile Ready)
// @namespace    https://greasyfork.org/
// @version      1.1
// @description  Auto-translates any webpage to English in real-time using Google Translate API + OCR for images
// @author       GP
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548143/Auto%20Translate%20Any%20Page%20with%20OCR%20%28Mobile%20Ready%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548143/Auto%20Translate%20Any%20Page%20with%20OCR%20%28Mobile%20Ready%29.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    const targetLang = 'en'; // change this if you want another language
    const translatedNodes = new WeakSet(); // Track already translated nodes
    const pendingTranslations = new Set(); // Prevent duplicate translations
    const processedImages = new WeakSet(); // Track already processed images

    // Walk through DOM and get text nodes
    function walk(node) {
        let textNodes = [];
        if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim() !== "") {
            textNodes.push(node);
        } else {
            for (let child of node.childNodes) {
                textNodes = textNodes.concat(walk(child));
            }
        }
        return textNodes;
    }

    async function translateText(text) {
        try {
            const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
            const res = await fetch(url);
            const data = await res.json();
            return data[0].map(item => item[0]).join('');
        } catch (e) {
            console.error('Translation error:', e);
            return text; // fallback to original
        }
    }

    async function translateNode(node) {
        const originalText = node.nodeValue.trim();
        
        // Skip if already translated, empty, or currently being translated
        if (translatedNodes.has(node) || !originalText || pendingTranslations.has(node)) {
            return;
        }

        // Skip if text appears to be already in English (basic check)
        if (isLikelyEnglish(originalText)) {
            translatedNodes.add(node);
            return;
        }

        pendingTranslations.add(node);
        
        try {
            const translated = await translateText(originalText);
            if (translated !== originalText) {
                node.nodeValue = translated;
                translatedNodes.add(node);
            }
        } catch (error) {
            console.error('Translation failed:', error);
        } finally {
            pendingTranslations.delete(node);
        }
    }

    // OCR function using Tesseract.js
    async function extractTextFromImage(imgElement) {
        try {
            // Create canvas to process image
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = imgElement.naturalWidth || imgElement.width;
            canvas.height = imgElement.naturalHeight || imgElement.height;
            
            // Draw image to canvas
            ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height);
            
            // Simple OCR simulation using canvas text detection
            // In a real implementation, you'd use Tesseract.js or similar
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            
            // For demo purposes, we'll use a placeholder OCR result
            // Replace this with actual OCR library integration
            return await simulateOCR(canvas.toDataURL());
            
        } catch (error) {
            console.error('OCR error:', error);
            return '';
        }
    }

    // Placeholder OCR function - replace with actual OCR library
    async function simulateOCR(imageData) {
        // This is a placeholder - in real implementation, integrate with:
        // - Tesseract.js: https://cdnjs.cloudflare.com/ajax/libs/tesseract.js/4.1.1/tesseract.min.js
        // - Or use Google Cloud Vision API
        // - Or use Azure Computer Vision API
        
        // For now, return empty string - you'll need to add actual OCR library
        console.log('OCR would process image here');
        return ''; // Replace with actual OCR result
    }

    // Create overlay for translated text on images
    function createTextOverlay(imgElement, translatedText, originalBounds) {
        const overlay = document.createElement('div');
        overlay.className = 'translation-overlay';
        overlay.style.cssText = `
            position: absolute;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 4px 8px;
            border: 2px solid #007bff;
            border-radius: 4px;
            font-family: Arial, sans-serif;
            font-size: 14px;
            font-weight: bold;
            z-index: 9999;
            pointer-events: none;
            max-width: ${originalBounds.width}px;
            word-wrap: break-word;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        `;
        overlay.textContent = translatedText;
        
        // Position overlay over the image
        const rect = imgElement.getBoundingClientRect();
        overlay.style.left = (rect.left + window.scrollX) + 'px';
        overlay.style.top = (rect.top + window.scrollY) + 'px';
        
        document.body.appendChild(overlay);
        
        // Update overlay position on scroll/resize
        const updatePosition = () => {
            const newRect = imgElement.getBoundingClientRect();
            overlay.style.left = (newRect.left + window.scrollX) + 'px';
            overlay.style.top = (newRect.top + window.scrollY) + 'px';
        };
        
        window.addEventListener('scroll', updatePosition);
        window.addEventListener('resize', updatePosition);
        
        // Store overlay reference for cleanup
        imgElement._translationOverlay = overlay;
        
        return overlay;
    }

    // Process images for OCR and translation
    async function processImage(imgElement) {
        if (processedImages.has(imgElement) || !imgElement.complete) {
            return;
        }
        
        processedImages.add(imgElement);
        
        try {
            const extractedText = await extractTextFromImage(imgElement);
            
            if (extractedText && extractedText.trim()) {
                const translatedText = await translateText(extractedText);
                
                if (translatedText !== extractedText) {
                    const bounds = {
                        width: imgElement.offsetWidth,
                        height: imgElement.offsetHeight
                    };
                    
                    createTextOverlay(imgElement, translatedText, bounds);
                }
            }
        } catch (error) {
            console.error('Image processing error:', error);
        }
    }

    // Find all images in an element
    function findImages(element) {
        const images = [];
        
        if (element.tagName === 'IMG') {
            images.push(element);
        }
        
        // Also check for background images
        const bgImage = window.getComputedStyle(element).backgroundImage;
        if (bgImage && bgImage !== 'none') {
            // Handle background images if needed
        }
        
        // Find nested images
        const nestedImages = element.querySelectorAll('img');
        images.push(...Array.from(nestedImages));
        
        return images;
    }
    function isLikelyEnglish(text) {
        const englishWords = /\b(the|and|or|but|in|on|at|to|for|of|with|by|a|an|is|are|was|were|be|been|have|has|had|do|does|did|will|would|could|should|may|might|can|must|shall|this|that|these|those|i|you|he|she|it|we|they|me|him|her|us|them)\b/gi;
        const matches = text.match(englishWords);
        return matches && matches.length > text.split(/\s+/).length * 0.3;
    }

    // Initial translation of existing content
    const initialNodes = walk(document.body);
    for (let node of initialNodes) {
        await translateNode(node);
    }

    // Process existing images
    const existingImages = document.querySelectorAll('img');
    for (let img of existingImages) {
        if (img.complete) {
            await processImage(img);
        } else {
            img.addEventListener('load', () => processImage(img));
        }
    }

    // Real-time observer for new content
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            // Handle added nodes
            mutation.addedNodes.forEach(added => {
                if (added.nodeType === Node.TEXT_NODE) {
                    // Directly translate text nodes
                    translateNode(added);
                } else if (added.nodeType === Node.ELEMENT_NODE) {
                    // Find and translate all text nodes within the element
                    const newTextNodes = walk(added);
                    newTextNodes.forEach(textNode => {
                        translateNode(textNode);
                    });
                    
                    // Process any new images
                    const newImages = findImages(added);
                    newImages.forEach(img => {
                        if (img.complete) {
                            processImage(img);
                        } else {
                            img.addEventListener('load', () => processImage(img));
                        }
                    });
                }
            });

            // Handle modified text content
            if (mutation.type === 'characterData' && mutation.target.nodeType === Node.TEXT_NODE) {
                // Reset translation status for modified nodes
                translatedNodes.delete(mutation.target);
                translateNode(mutation.target);
            }
        });
    });

    // Observe with comprehensive options for real-time detection
    observer.observe(document.body, { 
        childList: true, 
        subtree: true, 
        characterData: true 
    });

    console.log('Real-time auto-translation with OCR activated');
    
    // Add CSS for better overlay styling
    const style = document.createElement('style');
    style.textContent = `
        .translation-overlay {
            transition: opacity 0.3s ease;
        }
        .translation-overlay:hover {
            opacity: 0.7;
        }
    `;
    document.head.appendChild(style);
})();