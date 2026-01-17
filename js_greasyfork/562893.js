// ==UserScript==
// @name        IGG-Games HD Thumbnails
// @namespace   github.com/GreenMan36
// @version     1.0.1
// @description Replaces low-res thumbnails with high-res background images
// @author      GreenMan36
// @license     MIT
// @match       https://igg-games.com/
// @match       https://igg-games.com/page/*
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/562893/IGG-Games%20HD%20Thumbnails.user.js
// @updateURL https://update.greasyfork.org/scripts/562893/IGG-Games%20HD%20Thumbnails.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Default configuration
    const DEFAULTS = {
        borderRadius: 12,
        aspectRatioMode: 'dynamic',
        backgroundSize: 'cover',
        backgroundColor: '#1a1a1a',
    };

    // Load configuration
    const CONFIG = {
        borderRadius: GM_getValue('borderRadius', DEFAULTS.borderRadius),
        aspectRatioMode: GM_getValue('aspectRatioMode', DEFAULTS.aspectRatioMode),
        backgroundSize: GM_getValue('backgroundSize', DEFAULTS.backgroundSize),
        backgroundColor: GM_getValue('backgroundColor', DEFAULTS.backgroundColor),
    };

    // Aspect ratio presets (as CSS strings)
    const ASPECT_RATIOS = {
        'dynamic': null,
        '16:9': '16 / 9',
        '4:3': '4 / 3',
        '1:1': '1 / 1',
        '21:9': '21 / 9',
    };

    // =====================
    // MENU COMMANDS
    // =====================

    GM_registerMenuCommand(`🔘 Border Radius: ${CONFIG.borderRadius}px`, () => {
        const newValue = prompt('Enter border radius in pixels (0-50):', CONFIG.borderRadius);
        if (newValue !== null) {
            const parsed = parseInt(newValue, 10);
            if (!isNaN(parsed) && parsed >= 0 && parsed <= 50) {
                GM_setValue('borderRadius', parsed);
                location.reload();
            } else {
                alert('Please enter a number between 0 and 50');
            }
        }
    });

    GM_registerMenuCommand(`📐 Aspect Ratio: ${CONFIG.aspectRatioMode}`, () => {
        const options = Object.keys(ASPECT_RATIOS);
        const currentIndex = options.indexOf(CONFIG.aspectRatioMode);
        const nextIndex = (currentIndex + 1) % options.length;
        GM_setValue('aspectRatioMode', options[nextIndex]);
        location.reload();
    });

    GM_registerMenuCommand(`🖼️ Background Size: ${CONFIG.backgroundSize}`, () => {
        const newValue = CONFIG.backgroundSize === 'cover' ? 'contain' : 'cover';
        GM_setValue('backgroundSize', newValue);
        location.reload();
    });

    GM_registerMenuCommand(`🎨 Background Color: ${CONFIG.backgroundColor}`, () => {
        const newValue = prompt('Enter background color (hex or name):', CONFIG.backgroundColor);
        if (newValue !== null && newValue.trim()) {
            GM_setValue('backgroundColor', newValue.trim());
            location.reload();
        }
    });

    GM_registerMenuCommand('🔄 Reset to Defaults', () => {
        if (confirm('Reset all settings to defaults?')) {
            Object.keys(DEFAULTS).forEach(key => GM_setValue(key, DEFAULTS[key]));
            location.reload();
        }
    });

    // =====================
    // STYLES
    // =====================

    GM_addStyle(`
        article.uk-article div[property="image"] {
            border-radius: ${CONFIG.borderRadius}px;
            overflow: hidden;
            background-color: ${CONFIG.backgroundColor};
        }

        article.uk-article div[property="image"].hd-loaded {
            height: auto !important;
        }

        article.uk-article div[property="image"].hd-loaded a {
            opacity: 0;
            display: block;
            width: 100%;
        }

        article.uk-article div[property="image"].hd-loaded img {
            width: 100%;
            height: auto;
            visibility: hidden;
        }
    `);

    // =====================
    // THUMBNAIL UPGRADE
    // =====================

    function applyBackgroundStyles(imageContainer, hdUrl, aspectRatio) {
        imageContainer.style.backgroundImage = `url("${hdUrl}")`;
        imageContainer.style.backgroundPosition = 'center';
        imageContainer.style.backgroundSize = CONFIG.backgroundSize;
        imageContainer.style.backgroundRepeat = 'no-repeat';
        imageContainer.style.aspectRatio = aspectRatio;

        const link = imageContainer.querySelector('a');
        if (link) {
            link.style.aspectRatio = aspectRatio;
        }

        imageContainer.classList.add('hd-loaded');
    }

    function processArticle(article) {
        const imageContainer = article.querySelector('div[property="image"]');
        if (!imageContainer) return;

        if (imageContainer.dataset.hdUpgraded) return;
        imageContainer.dataset.hdUpgraded = 'true';

        const metaUrl = imageContainer.querySelector('meta[property="url"]');
        if (!metaUrl || !metaUrl.content) return;

        const hdUrl = metaUrl.content.replace(/-210x210\.jpg$/, '.jpg');
        const fixedRatio = ASPECT_RATIOS[CONFIG.aspectRatioMode];

        if (fixedRatio !== null) {
            // Fixed aspect ratio - apply immediately
            applyBackgroundStyles(imageContainer, hdUrl, fixedRatio);
        } else {
            // Dynamic - need to load HD image to get dimensions
            // Apply a temporary ratio while loading
            applyBackgroundStyles(imageContainer, hdUrl, '1 / 1');

            const hdImage = new Image();
            hdImage.onload = () => {
                const ratio = `${hdImage.naturalWidth} / ${hdImage.naturalHeight}`;
                imageContainer.style.aspectRatio = ratio;
                const link = imageContainer.querySelector('a');
                if (link) {
                    link.style.aspectRatio = ratio;
                }
            };
            hdImage.onerror = () => {
                console.warn('Failed to load HD image:', hdUrl);
            };
            hdImage.src = hdUrl;
        }
    }

    function upgradeArticleThumbnails() {
        const articles = document.querySelectorAll('article.uk-article');
        articles.forEach(processArticle);
    }

    // =====================
    // INTERSECTION OBSERVER (for lazy loading)
    // =====================

    const intersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const article = entry.target;
                processArticle(article);
                intersectionObserver.unobserve(article);
            }
        });
    }, {
        rootMargin: '200px', // Start loading 200px before entering viewport
    });

    function observeArticles() {
        const articles = document.querySelectorAll('article.uk-article:not([data-hd-observed])');
        articles.forEach(article => {
            article.dataset.hdObserved = 'true';
            intersectionObserver.observe(article);
        });
    }

    // =====================
    // INITIALIZATION
    // =====================

    // Process visible articles immediately
    upgradeArticleThumbnails();

    // Observe all articles for lazy loading
    observeArticles();

    // Watch for dynamically added content
    const mutationObserver = new MutationObserver((mutations) => {
        let hasNewArticles = false;
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1 && (node.matches?.('article') || node.querySelector?.('article'))) {
                    hasNewArticles = true;
                }
            });
        });
        if (hasNewArticles) {
            observeArticles();
        }
    });

    mutationObserver.observe(document.body, {
        childList: true,
        subtree: true
    });
})();