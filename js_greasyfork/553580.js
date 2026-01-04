// ==UserScript==
// @name         CircleFTP Dub And CamRip Labeler
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Adds DUB and CAM labels to thumbnails on CircleFTP
// @author       LaxyDevUserX
// @match        http://new.circleftp.net/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553580/CircleFTP%20Dub%20And%20CamRip%20Labeler.user.js
// @updateURL https://update.greasyfork.org/scripts/553580/CircleFTP%20Dub%20And%20CamRip%20Labeler.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Keywords that indicate dubbed content
    const dubKeywords = [
        'Dual Audio', 'Dubbed', 'Dub', 'Multi Audio',
        'Hin+Eng', 'Eng+Jap', 'Hin+Tam', 'Hin+Mal', 'Hin+Tel',
        'Hin+Kor', 'Eng+Hin', 'Jap+Eng', 'Kor+Hin', 'Chi+Eng',
        'Eng+Chi', 'Tam+Eng', 'Mal+Eng', 'Tel+Eng', 'Tur+Hin'
    ];

    // Keywords that indicate cam/low quality sources
    const camRipKeywords = [
        'PRE HDRip', 'Cam Rip', 'CAM', 'TS', 'TC', 'HDTS', 'HDCAM',
        'HDTC', 'CAMRip', 'DVDSCR', 'SCR', 'TELESYNC', 'TELECINE',
        'PDVD', 'Workprint', 'WP', 'PDTV', 'DSR', 'STV'
    ];

    // Cache for processed cards to avoid reprocessing
    const processedCards = new Set();

    // Add CSS for the labels
    const style = document.createElement('style');
    style.textContent = `
        .dub-label {
            position: absolute;
            top: 5px;
            right: 5px;
            background-color: #f4181c;
            color: white;
            padding: 4px 10px;
            border-radius: 4px;
            font-weight: bold;
            font-size: 12px;
            z-index: 9999;
            box-shadow: 0 2px 6px rgba(0,0,0,0.8);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            pointer-events: none;
            animation: fadeIn 0.3s ease-in;
            border: 1px solid rgba(255,255,255,0.3);
        }

        .dub-blue {
            background-color: #5C33F6;
        }

        .cam-rip-label {
            position: absolute;
            top: 5px;
            left: 5px;
            background-color: #D72638; /* Red for Cam Rip */
            color: white;
            padding: 4px 10px;
            border-radius: 4px;
            font-weight: bold;
            font-size: 12px;
            z-index: 9999;
            box-shadow: 0 2px 6px rgba(0,0,0,0.8);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            pointer-events: none;
            animation: fadeIn 0.3s ease-in;
            border: 1px solid rgba(255,255,255,0.3);
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.8); }
            to { opacity: 1; transform: scale(1); }
        }

        /* Ensure image containers have relative positioning */
        .SinglePost_singlePost_card__MLfCk > a > div {
            position: relative !important;
        }
    `;
    document.head.appendChild(style);

    // Function to check if text contains dub keywords
    function containsDubKeywords(text) {
        if (!text) return { hasDub: false, isBlue: false };

        const hasDub = dubKeywords.some(keyword => text.includes(keyword));

        // Check for specific combination: both "Dual Audio" and "Eng+Jap"
        const hasDualAudio = text.includes('Dual Audio');
        const hasEngJap = text.includes('Eng+Jap');
        const isBlue = hasDualAudio && hasEngJap;

        return { hasDub, isBlue };
    }

    // Function to check if text contains cam rip keywords
    function containsCamRipKeywords(text) {
        if (!text) return false;
        return camRipKeywords.some(keyword => text.includes(keyword));
    }

    // Function to add labels to a card
    function addLabels(card) {
        // Get a unique identifier for the card (using the href)
        const linkElement = card.querySelector('a');
        const cardId = linkElement ? linkElement.href : null;

        // Skip if already processed
        if (!cardId || processedCards.has(cardId)) return;

        // Check multiple places for keywords:
        // 1. The title attribute of the card div
        const cardTitle = card.getAttribute('title') || '';

        // 2. The h3 text content
        const h3Element = card.querySelector('h3');
        const h3Text = h3Element ? h3Element.textContent : '';

        // 3. The p tag text content
        const pElement = card.querySelector('p');
        const pText = pElement ? pElement.textContent : '';

        // Combine all text for checking
        const allText = `${cardTitle} ${h3Text} ${pText}`;

        // Check for dub keywords
        const { hasDub, isBlue } = containsDubKeywords(allText);

        // Check for cam rip keywords
        const hasCamRip = containsCamRipKeywords(allText);

        if (hasDub || hasCamRip) {
            // Find the image container
            const imageContainer = card.querySelector('.overflow-hidden.d-flex.justify-content-center.align-items-end.rounded');
            if (!imageContainer) {
                // Try alternative selector
                const img = card.querySelector('img.SinglePost_singlePost_image__roLcd');
                if (!img) return;

                const imageContainerAlt = img.parentElement;
                if (!imageContainerAlt) return;

                createAndAddLabels(imageContainerAlt, hasDub, isBlue, hasCamRip);
            } else {
                createAndAddLabels(imageContainer, hasDub, isBlue, hasCamRip);
            }

            // Mark as processed
            processedCards.add(cardId);
        }
    }

    function createAndAddLabels(container, hasDub, isBlue, hasCamRip) {
        // Add CAM RIP label if needed (left side)
        if (hasCamRip) {
            const camRipLabel = document.createElement('div');
            camRipLabel.className = 'cam-rip-label';
            camRipLabel.textContent = 'CAM';
            container.appendChild(camRipLabel);
        }

        // Add DUB label if needed (right side)
        if (hasDub) {
            const dubLabel = document.createElement('div');
            dubLabel.className = `dub-label ${isBlue ? 'dub-blue' : ''}`;
            dubLabel.textContent = 'DUB';
            container.appendChild(dubLabel);
        }
    }

    // Set up IntersectionObserver for lazy loading
    const observerOptions = {
        root: null, // viewport
        rootMargin: '200px', // start loading 200px before element comes into view
        threshold: 0.1 // trigger when 10% of element is visible
    };

    const intersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const card = entry.target;
                addLabels(card);
                // Stop observing this card once processed
                intersectionObserver.unobserve(card);
            }
        });
    }, observerOptions);

    // Function to observe all cards
    function observeAllCards() {
        const cards = document.querySelectorAll('.SinglePost_singlePost_card__MLfCk');
        cards.forEach(card => {
            // Get a unique identifier for the card
            const linkElement = card.querySelector('a');
            const cardId = linkElement ? linkElement.href : null;

            // Only observe if not already processed
            if (cardId && !processedCards.has(cardId)) {
                intersectionObserver.observe(card);
            }
        });
    }

    // Optimized observer for dynamic content
    let mutationTimeout;
    function setupMutationObserver() {
        const observer = new MutationObserver(mutations => {
            // Clear any pending timeout
            clearTimeout(mutationTimeout);

            // Set a new timeout to batch mutations
            mutationTimeout = setTimeout(() => {
                observeAllCards();
            }, 300); // 300ms delay to batch mutations
        });

        // Observe the entire document for added nodes
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Initialize the script
    function init() {
        // Process initial content after a short delay
        setTimeout(() => {
            observeAllCards();
        }, 500); // Reduced delay for faster initial loading

        // Setup mutation observer for dynamic content
        setTimeout(setupMutationObserver, 1000);
    }

    // Run the script when the page is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();