// ==UserScript==
// @name         Deadshot.io newawocomp.webp Replacement (Galaxy Skin)
// @namespace    http://tampermonkey.net/
// @run-at       document-start
// @version      1.0
// @description  Replace newawocomp.webp with galaxy skin - aggressive matching
// @author       You
// @match        https://deadshot.io/*
// @match        https://*.deadshot.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563099/Deadshotio%20newawocompwebp%20Replacement%20%28Galaxy%20Skin%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563099/Deadshotio%20newawocompwebp%20Replacement%20%28Galaxy%20Skin%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your galaxy skin URL
    const GALAXY_SKIN = 'https://files.catbox.moe/bvuqqf.webp';

    // ========================================
    // AGGRESSIVE MATCHING - Targets newawocomp.webp specifically
    // ========================================
    
    function shouldReplaceWithGalaxy(url) {
        const lowerUrl = url.toLowerCase();
        
        // Match newawocomp.webp exactly (case-insensitive)
        if (lowerUrl.includes('newawocomp.webp')) {
            return true;
        }
        
        return false;
    }

    // ========================================
    // LOGGING FUNCTION
    // ========================================
    
    function logSwap(type, url) {
        console.log(`%c[Galaxy Skin] ✨ ${type}`, 'color: #ff00ff; font-weight: bold');
        console.log(`  Original: ${url}`);
        console.log(`  Swapped to: ${GALAXY_SKIN}`);
    }

    // ========================================
    // FETCH INTERCEPTION
    // ========================================

    const originalFetch = window.fetch;
    window.fetch = function(resource, init) {
        const url = typeof resource === 'string' ? resource : resource.url;
        
        if (shouldReplaceWithGalaxy(url)) {
            logSwap('FETCH', url);
            return originalFetch(GALAXY_SKIN, init);
        }
        
        return originalFetch(resource, init);
    };

    // ========================================
    // XMLHttpRequest INTERCEPTION
    // ========================================

    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
        if (shouldReplaceWithGalaxy(url)) {
            logSwap('XHR', url);
            return originalOpen.call(this, method, GALAXY_SKIN, async, user, password);
        }
        
        return originalOpen.call(this, method, url, async, user, password);
    };

    // ========================================
    // IMAGE ELEMENT INTERCEPTION
    // ========================================

    const originalImageSrc = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');
    Object.defineProperty(HTMLImageElement.prototype, 'src', {
        get: function() {
            return originalImageSrc.get.call(this);
        },
        set: function(value) {
            if (shouldReplaceWithGalaxy(value)) {
                logSwap('Image.src', value);
                return originalImageSrc.set.call(this, GALAXY_SKIN);
            }
            return originalImageSrc.set.call(this, value);
        }
    });

    // ========================================
    // createElement INTERCEPTION
    // ========================================

    const originalCreateElement = document.createElement;
    document.createElement = function(tagName, options) {
        const element = originalCreateElement.call(document, tagName, options);
        
        if (tagName.toLowerCase() === 'img') {
            const srcDescriptor = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');
            Object.defineProperty(element, 'src', {
                get: function() {
                    return srcDescriptor.get.call(this);
                },
                set: function(value) {
                    if (shouldReplaceWithGalaxy(value)) {
                        logSwap('createElement img', value);
                        return srcDescriptor.set.call(this, GALAXY_SKIN);
                    }
                    return srcDescriptor.set.call(this, value);
                }
            });
        }
        
        return element;
    };

    // ========================================
    // setAttribute INTERCEPTION
    // ========================================

    const originalSetAttribute = Element.prototype.setAttribute;
    Element.prototype.setAttribute = function(name, value) {
        if ((name === 'src' || name === 'href') && shouldReplaceWithGalaxy(value)) {
            logSwap('setAttribute', value);
            return originalSetAttribute.call(this, name, GALAXY_SKIN);
        }
        return originalSetAttribute.call(this, name, value);
    };

    // ========================================
    // CSS BACKGROUND IMAGE INTERCEPTION
    // ========================================

    const originalSetProperty = CSSStyleDeclaration.prototype.setProperty;
    CSSStyleDeclaration.prototype.setProperty = function(property, value, priority) {
        if ((property === 'background-image' || property === 'background') && typeof value === 'string') {
            const urlMatch = value.match(/url(['"]?([^'"]+)['"]?)/);
            if (urlMatch && shouldReplaceWithGalaxy(urlMatch[1])) {
                logSwap('CSS background', urlMatch[1]);
                value = value.replace(urlMatch[1], GALAXY_SKIN);
            }
        }
        return originalSetProperty.call(this, property, value, priority);
    };

    // ========================================
    // CANVAS/WEBGL TEXTURE INTERCEPTION
    // ========================================

    // Intercept canvas texImage2D (used by WebGL games)
    if (window.WebGLRenderingContext) {
        const originalTexImage2D = WebGLRenderingContext.prototype.texImage2D;
        WebGLRenderingContext.prototype.texImage2D = function(...args) {
            // Check if the image source is an Image element with newawocomp.webp in src
            if (args[5] && args[5].src && shouldReplaceWithGalaxy(args[5].src)) {
                logSwap('WebGL texImage2D', args[5].src);
                // Load our galaxy texture instead
                const img = new Image();
                img.crossOrigin = 'anonymous';
                img.src = GALAXY_SKIN;
                args[5] = img;
            }
            return originalTexImage2D.apply(this, args);
        };
    }

    // ========================================
    // MUTATION OBSERVER
    // ========================================

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.tagName === 'IMG' && node.src && shouldReplaceWithGalaxy(node.src)) {
                    logSwap('Dynamic img', node.src);
                    node.src = GALAXY_SKIN;
                }
            });
        });
    });

    if (document.body) {
        observer.observe(document.body, { childList: true, subtree: true });
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            observer.observe(document.body, { childList: true, subtree: true });
        });
    }

    // ========================================
    // STARTUP LOGGING
    // ========================================

    console.log('%c🌌 newawocomp.webp GALAXY SKIN LOADED! 🌌', 'color: #ff00ff; font-size: 20px; font-weight: bold');
    console.log('%cThis script will replace newawocomp.webp with your galaxy skin', 'color: #00ffff');
    console.log('%cWatch this console for "[Galaxy Skin] ✨" messages to see what gets swapped', 'color: #00ffff');

})();