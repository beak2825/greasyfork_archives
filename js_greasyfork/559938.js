// ==UserScript==
// @name            7chan Enhacenements
// @namespace       861ddd094884eac5bea7a3b12e074f34
// @version         1.3
// @description     Constrains expanded media to viewport and scrolls back to post when contracting
// @author          Claude 4.5 Sonnet
// @match           https://7chan.org/*
// @grant           none
// @license         MIT-0
// @downloadURL https://update.greasyfork.org/scripts/559938/7chan%20Enhacenements.user.js
// @updateURL https://update.greasyfork.org/scripts/559938/7chan%20Enhacenements.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const state = {
        expandedImages: new Map(), // Maps img element to {postId, originalScroll, wasExpanded}
        processingImages: new WeakSet() // Track images currently being processed
    };

    function getPostIdFromImage(img) {
        const post = img.closest('.post');
        return post ? post.id : null;
    }

    function isImageExpanded(img) {
        // Check if src points to full image (not thumbnail with 's' before extension)
        const thumbPattern = /thumb\/.*s\.(jpg|png|gif|webm)$/;
        return img.src && !thumbPattern.test(img.src);
    }

    function applyViewportConstraints(img) {
        if (!isImageExpanded(img)) return;

        const post = img.closest('.post');
        if (!post) return;

        const postRect = post.getBoundingClientRect();
        const viewportWidth = document.documentElement.clientWidth;
        const viewportHeight = document.documentElement.clientHeight;

        // Calculate available space (accounting for post position and margins)
        const availableWidth = viewportWidth - postRect.left - 35;
        const availableHeight = viewportHeight - 100;

        // Apply constraints
        img.style.maxWidth = Math.max(availableWidth * 0.95, 300) + 'px';
        img.style.maxHeight = Math.max(availableHeight * 0.95, 300) + 'px';
        img.style.width = 'auto';
        img.style.height = 'auto';
        img.style.objectFit = 'contain';
    }

    function removeViewportConstraints(img) {
        // Remove our custom styles when contracting
        img.style.maxWidth = '';
        img.style.maxHeight = '';
        img.style.objectFit = '';
    }

    function handleImageChange(img) {
        // Prevent processing the same image multiple times for batched mutations
        if (state.processingImages.has(img)) return;
        state.processingImages.add(img);

        // Use requestAnimationFrame to batch multiple attribute changes
        requestAnimationFrame(() => {
            state.processingImages.delete(img);

            const postId = getPostIdFromImage(img);
            if (!postId) return;

            const isExpanded = isImageExpanded(img);
            const savedState = state.expandedImages.get(img);
            const wasExpanded = savedState ? savedState.wasExpanded : false;

            if (isExpanded && !wasExpanded) {
                // Image was just expanded
                state.expandedImages.set(img, {
                    postId: postId,
                    originalScroll: window.scrollY,
                    wasExpanded: true
                });
                applyViewportConstraints(img);
            } else if (!isExpanded && wasExpanded) {
                // Image was just contracted
                removeViewportConstraints(img);
                
                if (savedState) {
                    state.expandedImages.delete(img);
                    
                    // Restore scroll position to the post
                    requestAnimationFrame(() => {
                        const postElement = document.getElementById(savedState.postId);
                        if (postElement) {
                            const postTop = postElement.getBoundingClientRect().top + window.scrollY;
                            window.scrollTo({
                                top: postTop - 20,
                                behavior: 'smooth'
                            });
                        }
                    });
                }
            } else if (isExpanded && wasExpanded) {
                // Image is still expanded, update state
                if (savedState) {
                    savedState.wasExpanded = true;
                }
            }
        });
    }

    // Single observer for all images
    function setupObserver() {
        const observer = new MutationObserver((mutations) => {
            const processedImages = new Set();

            for (const mutation of mutations) {
                if (mutation.type === 'attributes') {
                    const img = mutation.target;
                    if ((img.classList.contains('thumb') || 
                         img.classList.contains('multithumb') || 
                         img.classList.contains('multithumbfirst')) &&
                        !processedImages.has(img)) {
                        processedImages.add(img);
                        handleImageChange(img);
                    }
                }
            }
        });

        const config = {
            attributes: true,
            attributeFilter: ['src', 'style', 'width', 'height'],
            subtree: true
        };

        // Observe the entire page with subtree:true for efficiency
        observer.observe(document.body, config);

        return observer;
    }

    // Handle window resize - reapply constraints to expanded images
    let resizeTimeout;
    function handleResize() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            state.expandedImages.forEach((value, img) => {
                if (value.wasExpanded && isImageExpanded(img)) {
                    applyViewportConstraints(img);
                }
            });
        }, 100); // Debounce resize events
    }

    // Initialize
    function init() {
        setupObserver();
        window.addEventListener('resize', handleResize);
        
        // Apply constraints to any already-expanded images
        document.querySelectorAll('img.thumb, img.multithumb, img.multithumbfirst').forEach(img => {
            if (isImageExpanded(img)) {
                const postId = getPostIdFromImage(img);
                if (postId) {
                    state.expandedImages.set(img, {
                        postId: postId,
                        originalScroll: window.scrollY,
                        wasExpanded: true
                    });
                    applyViewportConstraints(img);
                }
            }
        });
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();