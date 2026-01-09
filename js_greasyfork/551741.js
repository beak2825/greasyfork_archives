// ==UserScript==
// @name         enhanced mass-image
// @namespace    https://greasyfork.org/de/users/1516523-martink
// @version      1.1.0
// @description  Fügt "Gallery Mode" toggle in mass-image hinzu.
// @author       Martin Kaiser
// @match        https://opus.geizhals.at/kalif/artikel/mass-image*
// @run-at       document-start
// @grant        none
// @license      MIT
// @icon         https://666kb.com/i/fxfm86s1jawf7ztn7.jpg
// @downloadURL https://update.greasyfork.org/scripts/551741/enhanced%20mass-image.user.js
// @updateURL https://update.greasyfork.org/scripts/551741/enhanced%20mass-image.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let autoGalleryEnabled = false;

    try {
        // Read URL parameter immediately before page can modify it
        const urlParams = new URLSearchParams(window.location.search);
        const autoGalleryParam = urlParams.get('autoGallery') === 'true';

        // Store with timestamp if parameter is present
        if (autoGalleryParam) {
            const storageKey = 'massImageAutoGallery_' + window.location.pathname;
            sessionStorage.setItem(storageKey, Date.now().toString());
        }

        // Check if we should auto-activate (parameter was set within last 2 seconds)
        function shouldAutoActivate() {
            try {
                const storageKey = 'massImageAutoGallery_' + window.location.pathname;
                const timestamp = sessionStorage.getItem(storageKey);

                if (!timestamp) return false;

                const age = Date.now() - parseInt(timestamp);
                const isRecent = age < 2000; // 2 seconds

                // Clean up immediately after checking
                if (isRecent) {
                    sessionStorage.removeItem(storageKey);
                }

                return isRecent;
            } catch (e) {
                return false;
            }
        }

        autoGalleryEnabled = shouldAutoActivate();
    } catch (e) {
        // Silent fail
    }

    let galleryModeActive = autoGalleryEnabled;
    let imageScale = 100;
    let userSetImageScale = 100; // Stores the user's manually set scale
    let styleElement = null;
    let imageRangeFilter = null;
    let hoverAnimationDisabled = true;

    // Comparison mode state
    let comparisonModeActive = false;
    let comparisonViewActive = false;
    let comparisonLayoutHorizontal = false;
    let selectedImages = new Set();

    // Scale values array (defined globally for consistency)
    const scaleValues = [50, 75, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800];
    const defaultScaleIndex = 2; // 100%

    // Base image dimensions
    const baseWidth = 200;
    const baseHeight = 250;
    const imageGap = 20;
    const containerPadding = 20;

    function createHoverZoomOverlay() {
        try {
            if (document.getElementById('hover-zoom-overlay')) return;

            const overlay = document.createElement('div');
            overlay.id = 'hover-zoom-overlay';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.9);
                display: none;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                pointer-events: none;
            `;

            const zoomImg = document.createElement('img');
            zoomImg.id = 'hover-zoom-image';
            zoomImg.style.cssText = `
                max-width: 90%;
                max-height: 90%;
                object-fit: contain;
            `;

            overlay.appendChild(zoomImg);
            document.body.appendChild(overlay);
        } catch (e) {
            // Silent fail
        }
    }

    function setupImageHoverZoom() {
        try {
            if (hoverAnimationDisabled) {
                removeImageHoverZoom();
                return;
            }

            createHoverZoomOverlay();
            const overlay = document.getElementById('hover-zoom-overlay');
            const zoomImg = document.getElementById('hover-zoom-image');

            if (!overlay || !zoomImg) return;

            const products = document.querySelectorAll('.bg-white.p-1');
            products.forEach(product => {
                try {
                    const images = product.querySelectorAll('.d-flex.gap-2.my-2 img');
                    images.forEach(img => {
                        try {
                            img.style.cursor = 'zoom-in';

                            img.onmouseenter = () => {
                                try {
                                    if (hoverAnimationDisabled) return;
                                    zoomImg.src = img.src;
                                    overlay.style.display = 'flex';
                                } catch (e) {
                                    // Silent fail
                                }
                            };

                            img.onmouseleave = () => {
                                try {
                                    overlay.style.display = 'none';
                                } catch (e) {
                                    // Silent fail
                                }
                            };
                        } catch (e) {
                            // Silent fail
                        }
                    });
                } catch (e) {
                    // Silent fail
                }
            });
        } catch (e) {
            // Silent fail
        }
    }

    function removeImageHoverZoom() {
        try {
            const products = document.querySelectorAll('.bg-white.p-1');
            products.forEach(product => {
                try {
                    const images = product.querySelectorAll('.d-flex.gap-2.my-2 img');
                    images.forEach(img => {
                        try {
                            img.style.cursor = '';
                            img.onmouseenter = null;
                            img.onmouseleave = null;
                        } catch (e) {
                            // Silent fail
                        }
                    });
                } catch (e) {
                    // Silent fail
                }
            });

            const overlay = document.getElementById('hover-zoom-overlay');
            if (overlay) {
                overlay.style.display = 'none';
            }
        } catch (e) {
            // Silent fail
        }
    }

    function parseImageRange(rangeStr) {
        try {
            if (!rangeStr || rangeStr.trim() === '') return null;

            const indices = new Set();
            const parts = rangeStr.split(/[\s,]+/);

            for (const part of parts) {
                try {
                    if (part.startsWith('-')) {
                        const num = parseInt(part.substring(1));
                        if (!isNaN(num)) {
                            indices.delete(num);
                        }
                    } else if (part.includes('-')) {
                        const [start, end] = part.split('-').map(n => parseInt(n));
                        if (!isNaN(start) && !isNaN(end)) {
                            for (let i = start; i <= end; i++) {
                                indices.add(i);
                            }
                        }
                    } else {
                        const num = parseInt(part);
                        if (!isNaN(num)) {
                            indices.add(num);
                        }
                    }
                } catch (e) {
                    // Silent fail for individual part
                }
            }

            return indices.size > 0 ? indices : null;
        } catch (e) {
            return null;
        }
    }

    function getImageId(img) {
        try {
            return img.src;
        } catch (e) {
            return '';
        }
    }

    function updateCompareButton() {
        try {
            const compareBtn = document.getElementById('compare-button');
            if (compareBtn && !comparisonViewActive) {
                compareBtn.disabled = selectedImages.size === 0;
                compareBtn.style.opacity = selectedImages.size === 0 ? '0.5' : '1';
                compareBtn.style.cursor = selectedImages.size === 0 ? 'not-allowed' : 'pointer';
            }
        } catch (e) {
            // Silent fail
        }
    }

    function updateImageGrayscale(img, wrapper) {
        try {
            if (!comparisonModeActive || comparisonViewActive) {
                // Not in comparison mode or in active comparison view - no grayscale
                img.style.filter = '';
                img.style.opacity = '';
            } else {
                // In comparison mode - check if selected
                const imgId = getImageId(img);
                if (selectedImages.has(imgId)) {
                    // Selected - no grayscale
                    img.style.filter = '';
                    img.style.opacity = '';
                } else {
                    // Not selected - grayscale
                    img.style.filter = 'grayscale(100%)';
                    img.style.opacity = '0.5';
                }
            }
        } catch (e) {
            // Silent fail
        }
    }

    function updateAllImagesGrayscale() {
        try {
            const products = document.querySelectorAll('.bg-white.p-1');
            products.forEach(product => {
                try {
                    const images = product.querySelectorAll('.d-flex.gap-2.my-2 img');
                    images.forEach(img => {
                        try {
                            const wrapper = img.closest('.p-2.position-relative.border');
                            updateImageGrayscale(img, wrapper);
                        } catch (e) {
                            // Silent fail
                        }
                    });
                } catch (e) {
                    // Silent fail
                }
            });
        } catch (e) {
            // Silent fail
        }
    }

    function toggleImageSelection(img, wrapper) {
        try {
            if (!comparisonModeActive || comparisonViewActive) return;

            const imgId = getImageId(img);

            if (selectedImages.has(imgId)) {
                selectedImages.delete(imgId);
                wrapper.style.outline = '';
                wrapper.style.outlineOffset = '';
            } else {
                selectedImages.add(imgId);
                wrapper.style.outline = '3px solid #0d6efd';
                wrapper.style.outlineOffset = '2px';
            }

            // Update grayscale for this image
            updateImageGrayscale(img, wrapper);

            updateCompareButton();
        } catch (e) {
            // Silent fail
        }
    }

    function setupImageClickHandlers() {
        try {
            const products = document.querySelectorAll('.bg-white.p-1');
            products.forEach(product => {
                try {
                    const images = product.querySelectorAll('.d-flex.gap-2.my-2 img');
                    images.forEach(img => {
                        try {
                            const wrapper = img.closest('.p-2.position-relative.border');
                            if (!wrapper) return;

                            // Remove existing handler
                            wrapper.onclick = null;

                            if (comparisonModeActive && !comparisonViewActive) {
                                wrapper.style.cursor = 'pointer';
                                wrapper.onclick = (e) => {
                                    try {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        toggleImageSelection(img, wrapper);
                                    } catch (err) {
                                        // Silent fail
                                    }
                                };

                                // Restore selection state
                                const imgId = getImageId(img);
                                if (selectedImages.has(imgId)) {
                                    wrapper.style.outline = '3px solid #0d6efd';
                                    wrapper.style.outlineOffset = '2px';
                                } else {
                                    wrapper.style.outline = '';
                                    wrapper.style.outlineOffset = '';
                                }

                                // Update grayscale
                                updateImageGrayscale(img, wrapper);
                            } else {
                                wrapper.style.cursor = '';
                                wrapper.style.outline = '';
                                wrapper.style.outlineOffset = '';
                                // Remove grayscale when not in comparison mode
                                updateImageGrayscale(img, wrapper);
                            }
                        } catch (e) {
                            // Silent fail
                        }
                    });
                } catch (e) {
                    // Silent fail
                }
            });
        } catch (e) {
            // Silent fail
        }
    }

    function clearAllSelections() {
        try {
            selectedImages.clear();
            const products = document.querySelectorAll('.bg-white.p-1');
            products.forEach(product => {
                try {
                    const images = product.querySelectorAll('.d-flex.gap-2.my-2 img');
                    images.forEach(img => {
                        try {
                            const wrapper = img.closest('.p-2.position-relative.border');
                            if (wrapper) {
                                wrapper.style.outline = '';
                                wrapper.style.outlineOffset = '';
                            }
                        } catch (e) {
                            // Silent fail
                        }
                    });
                } catch (e) {
                    // Silent fail
                }
            });
            updateCompareButton();
            // Update grayscale for all images
            updateAllImagesGrayscale();
        } catch (e) {
            // Silent fail
        }
    }

    function updateComparisonLayout() {
        try {
            const comparisonContainer = document.getElementById('comparison-container');
            if (!comparisonContainer) return;

            if (comparisonLayoutHorizontal) {
                comparisonContainer.style.flexDirection = 'row';
                comparisonContainer.style.flexWrap = 'wrap';
                comparisonContainer.style.justifyContent = 'center';
            } else {
                comparisonContainer.style.flexDirection = 'column';
                comparisonContainer.style.flexWrap = 'nowrap';
                comparisonContainer.style.justifyContent = 'flex-start';
            }
        } catch (e) {
            // Silent fail
        }
    }

    function showLayoutButton() {
        try {
            let layoutBtn = document.getElementById('layout-toggle-button');
            if (!layoutBtn) {
                layoutBtn = document.createElement('button');
                layoutBtn.id = 'layout-toggle-button';
                layoutBtn.textContent = 'horizontal';
                layoutBtn.style.cssText = 'padding: 4px 12px; border: 1px solid #6c757d; border-radius: 4px; font-size: 14px; background: #6c757d; color: white; cursor: pointer; margin-left: 8px;';

                layoutBtn.onclick = () => {
                    try {
                        comparisonLayoutHorizontal = !comparisonLayoutHorizontal;
                        layoutBtn.textContent = comparisonLayoutHorizontal ? 'vertikal' : 'horizontal';
                        updateComparisonLayout();
                    } catch (e) {
                        // Silent fail
                    }
                };

                const compareBtn = document.getElementById('compare-button');
                if (compareBtn && compareBtn.parentElement) {
                    compareBtn.parentElement.appendChild(layoutBtn);
                }
            }
            layoutBtn.style.display = 'inline-block';
            layoutBtn.textContent = comparisonLayoutHorizontal ? 'vertikal' : 'horizontal';
        } catch (e) {
            // Silent fail
        }
    }

    function hideLayoutButton() {
        try {
            const layoutBtn = document.getElementById('layout-toggle-button');
            if (layoutBtn) {
                layoutBtn.style.display = 'none';
            }
            comparisonLayoutHorizontal = false;
        } catch (e) {
            // Silent fail
        }
    }

    function calculateOptimalLayout(imageCount) {
        try {
            // Get viewport dimensions
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            // Reserve space for header/controls (approximate)
            const headerHeight = 150;
            const availableWidth = viewportWidth - containerPadding * 2 - 40; // 40 for scrollbar and margins
            const availableHeight = viewportHeight - headerHeight - containerPadding * 2;

            // Calculate optimal scale for vertical layout
            // All images stacked vertically
            const verticalTotalGaps = (imageCount - 1) * imageGap;
            const verticalAvailableForImages = availableHeight - verticalTotalGaps;
            const verticalScaleByHeight = (verticalAvailableForImages / imageCount) / baseHeight * 100;
            const verticalScaleByWidth = availableWidth / baseWidth * 100;
            const verticalOptimalScale = Math.min(verticalScaleByHeight, verticalScaleByWidth);

            // Calculate used space for vertical layout
            const verticalUsedWidth = baseWidth * (verticalOptimalScale / 100);
            const verticalUsedHeight = imageCount * baseHeight * (verticalOptimalScale / 100) + verticalTotalGaps;
            const verticalUnusedSpace = (availableWidth - verticalUsedWidth) * availableHeight +
                                        (availableHeight - verticalUsedHeight) * verticalUsedWidth;

            // Calculate optimal scale for horizontal layout
            // All images in a row (or multiple rows if needed)
            const horizontalTotalGaps = (imageCount - 1) * imageGap;
            const horizontalAvailableForImages = availableWidth - horizontalTotalGaps;
            const horizontalScaleByWidth = (horizontalAvailableForImages / imageCount) / baseWidth * 100;
            const horizontalScaleByHeight = availableHeight / baseHeight * 100;
            const horizontalOptimalScale = Math.min(horizontalScaleByWidth, horizontalScaleByHeight);

            // Calculate used space for horizontal layout
            const horizontalUsedWidth = imageCount * baseWidth * (horizontalOptimalScale / 100) + horizontalTotalGaps;
            const horizontalUsedHeight = baseHeight * (horizontalOptimalScale / 100);
            const horizontalUnusedSpace = (availableWidth - horizontalUsedWidth) * availableHeight +
                                          (availableHeight - horizontalUsedHeight) * horizontalUsedWidth;

            // Choose layout with less unused space
            let useHorizontal;
            let optimalScale;

            if (horizontalUnusedSpace < verticalUnusedSpace && horizontalOptimalScale > 30) {
                useHorizontal = true;
                optimalScale = horizontalOptimalScale;
            } else {
                useHorizontal = false;
                optimalScale = verticalOptimalScale;
            }

            // Clamp scale between reasonable limits
            optimalScale = Math.max(30, Math.min(800, optimalScale));

            return {
                useHorizontal,
                optimalScale: Math.round(optimalScale)
            };
        } catch (e) {
            return {
                useHorizontal: false,
                optimalScale: 100
            };
        }
    }

    function updateSliderDisplay(scale) {
        try {
            const scaleValueDisplay = document.querySelector('#gallery-scale-display');
            if (scaleValueDisplay) {
                scaleValueDisplay.textContent = `${scale}%`;
            }
        } catch (e) {
            // Silent fail
        }
    }

    function findNearestSliderIndex(scale) {
        try {
            let nearestIndex = 0;
            let minDiff = Math.abs(scaleValues[0] - scale);

            for (let i = 1; i < scaleValues.length; i++) {
                const diff = Math.abs(scaleValues[i] - scale);
                if (diff < minDiff) {
                    minDiff = diff;
                    nearestIndex = i;
                }
            }

            return nearestIndex;
        } catch (e) {
            return defaultScaleIndex;
        }
    }

    function activateComparisonView() {
        try {
            if (selectedImages.size < 2) {
                alert('Bitte mindestens zwei Bilder auswählen.');
                return;
            }

            // Save user's current scale setting before changing it
            userSetImageScale = imageScale;

            comparisonViewActive = true;

            const compareBtn = document.getElementById('compare-button');
            if (compareBtn) {
                compareBtn.textContent = 'Vergleich beenden';
                compareBtn.disabled = false;
                compareBtn.style.opacity = '1';
                compareBtn.style.cursor = 'pointer';
            }

            // Calculate optimal layout and scale
            const { useHorizontal, optimalScale } = calculateOptimalLayout(selectedImages.size);

            // Set the optimal layout
            comparisonLayoutHorizontal = useHorizontal;

            // Set the optimal scale
            imageScale = optimalScale;
            updateSliderDisplay(imageScale);

            // Update slider position to nearest value (visual only)
            const scaleSlider = document.getElementById('gallery-scale-slider');
            if (scaleSlider) {
                const nearestIndex = findNearestSliderIndex(imageScale);
                scaleSlider.value = nearestIndex;
            }

            // Show layout toggle button
            showLayoutButton();

            // Hide all products
            const products = document.querySelectorAll('.bg-white.p-1');
            products.forEach(product => {
                try {
                    product.style.display = 'none';
                } catch (e) {
                    // Silent fail
                }
            });

            // Create comparison container
            let comparisonContainer = document.getElementById('comparison-container');
            if (!comparisonContainer) {
                comparisonContainer = document.createElement('div');
                comparisonContainer.id = 'comparison-container';
                comparisonContainer.style.cssText = 'display: flex; flex-direction: column; align-items: center; gap: 20px; padding: 20px; background: #f8f9fa; border-radius: 8px; margin: 10px 0;';

                // Insert before the first product
                const firstProduct = document.querySelector('.bg-white.p-1');
                if (firstProduct && firstProduct.parentElement) {
                    firstProduct.parentElement.insertBefore(comparisonContainer, firstProduct);
                }
            }

            comparisonContainer.innerHTML = '';
            comparisonContainer.style.display = 'flex';

            const scaledSize = Math.round(baseWidth * (imageScale / 100));
            const scaledHeight = Math.round(baseHeight * (imageScale / 100));

            // Add selected images to comparison container
            selectedImages.forEach(imgSrc => {
                try {
                    const imgWrapper = document.createElement('div');
                    imgWrapper.style.cssText = 'padding: 8px; background: white; border: 1px solid #dee2e6; border-radius: 4px;';

                    const img = document.createElement('img');
                    img.src = imgSrc;
                    img.style.cssText = `display: block; max-width: ${scaledSize}px; max-height: ${scaledHeight}px; width: auto; height: auto;`;

                    imgWrapper.appendChild(img);
                    comparisonContainer.appendChild(imgWrapper);
                } catch (e) {
                    // Silent fail
                }
            });

            // Apply current layout
            updateComparisonLayout();
        } catch (e) {
            // Silent fail
        }
    }

    function deactivateComparisonView() {
        try {
            comparisonViewActive = false;

            const compareBtn = document.getElementById('compare-button');
            if (compareBtn) {
                compareBtn.textContent = 'Vergleich';
            }

            // Hide layout toggle button
            hideLayoutButton();

            // Restore user's scale setting
            imageScale = userSetImageScale;
            updateSliderDisplay(imageScale);

            // Restore slider position
            const scaleSlider = document.getElementById('gallery-scale-slider');
            if (scaleSlider) {
                const nearestIndex = findNearestSliderIndex(imageScale);
                scaleSlider.value = nearestIndex;
            }

            // Remove comparison container
            const comparisonContainer = document.getElementById('comparison-container');
            if (comparisonContainer) {
                comparisonContainer.style.display = 'none';
                comparisonContainer.innerHTML = '';
            }

            // Show all products again
            const products = document.querySelectorAll('.bg-white.p-1');
            products.forEach(product => {
                try {
                    product.style.display = '';
                } catch (e) {
                    // Silent fail
                }
            });

            // Clear selections
            clearAllSelections();

            // Re-apply gallery mode
            if (galleryModeActive) {
                activateGalleryMode();
            }
        } catch (e) {
            // Silent fail
        }
    }

    function updateComparisonViewScale() {
        try {
            if (!comparisonViewActive) return;

            const comparisonContainer = document.getElementById('comparison-container');
            if (!comparisonContainer) return;

            const scaledSize = Math.round(baseWidth * (imageScale / 100));
            const scaledHeight = Math.round(baseHeight * (imageScale / 100));

            const images = comparisonContainer.querySelectorAll('img');
            images.forEach(img => {
                try {
                    img.style.maxWidth = `${scaledSize}px`;
                    img.style.maxHeight = `${scaledHeight}px`;
                } catch (e) {
                    // Silent fail
                }
            });
        } catch (e) {
            // Silent fail
        }
    }

    function createToggleButton() {
        try {
            const header = document.querySelector('h4');
            if (!header || document.getElementById('gallery-mode-toggle')) {
                return;
            }

            const toggleContainer = document.createElement('div');
            toggleContainer.style.cssText = 'display: inline-flex; align-items: center; gap: 16px; margin-right: 20px; flex-wrap: wrap;';

            // Gallery Mode Toggle
            const label = document.createElement('label');
            label.style.cssText = 'display: inline-flex; align-items: center; cursor: pointer; user-select: none; gap: 8px; white-space: nowrap;';

            const text = document.createElement('span');
            text.textContent = 'Gallery Mode';
            text.style.cssText = 'font-weight: normal; font-size: 14px;';

            const toggleSwitch = document.createElement('div');
            toggleSwitch.style.cssText = `
                position: relative;
                width: 44px;
                height: 24px;
                background: ${galleryModeActive ? '#4CAF50' : '#ccc'};
                border-radius: 12px;
                cursor: pointer;
                transition: background 0.3s;
                flex-shrink: 0;
            `;

            const toggleSlider = document.createElement('div');
            toggleSlider.style.cssText = `
                position: absolute;
                top: 2px;
                left: 2px;
                width: 20px;
                height: 20px;
                background: white;
                border-radius: 50%;
                transition: transform 0.3s;
                transform: translateX(${galleryModeActive ? '20px' : '0'});
            `;

            toggleSwitch.appendChild(toggleSlider);

            const hiddenCheckbox = document.createElement('input');
            hiddenCheckbox.type = 'checkbox';
            hiddenCheckbox.id = 'gallery-mode-toggle';
            hiddenCheckbox.checked = galleryModeActive;
            hiddenCheckbox.style.display = 'none';

            label.appendChild(text);
            label.appendChild(toggleSwitch);

            // Controls Container
            const controlsContainer = document.createElement('div');
            controlsContainer.style.cssText = `display: ${galleryModeActive ? 'flex' : 'none'}; align-items: center; gap: 0; flex-wrap: wrap;`;

            // === Section 1: Bildnummer(n) filtern ===
            const filterSection = document.createElement('div');
            filterSection.style.cssText = 'display: flex; align-items: center; gap: 8px; padding: 4px 12px; border: 1px solid #000; border-radius: 4px; margin-right: 8px;';

            const filterLabel = document.createElement('label');
            filterLabel.textContent = 'Bildnummer(n) filtern';
            filterLabel.style.cssText = 'font-weight: normal; font-size: 14px; white-space: nowrap;';

            const rangeInput = document.createElement('input');
            rangeInput.type = 'text';
            rangeInput.placeholder = 'z. B. 2, 2-5, 2 3 5 oder 2-5 -3';
            rangeInput.style.cssText = 'padding: 4px 8px; border: 1px solid #ccc; border-radius: 4px; font-size: 14px; width: 200px;';

            filterSection.appendChild(filterLabel);
            filterSection.appendChild(rangeInput);

            // === Section 2: Größe ===
            const scaleSection = document.createElement('div');
            scaleSection.style.cssText = 'display: flex; align-items: center; gap: 8px; padding: 4px 12px; border: 1px solid #000; border-radius: 4px; margin-right: 8px;';

            const scaleLabel = document.createElement('label');
            scaleLabel.textContent = 'Größe:';
            scaleLabel.style.cssText = 'font-weight: normal; font-size: 14px; white-space: nowrap;';

            const scaleValueDisplay = document.createElement('span');
            scaleValueDisplay.id = 'gallery-scale-display';
            scaleValueDisplay.textContent = `${imageScale}%`;
            scaleValueDisplay.style.cssText = 'font-size: 14px; min-width: 45px; text-align: right;';

            const scaleSlider = document.createElement('input');
            scaleSlider.type = 'range';
            scaleSlider.id = 'gallery-scale-slider';
            scaleSlider.min = '0';
            scaleSlider.max = '16';
            scaleSlider.value = defaultScaleIndex.toString();

            // Synchronize imageScale with slider value
            imageScale = scaleValues[defaultScaleIndex];
            userSetImageScale = imageScale;
            scaleValueDisplay.textContent = `${imageScale}%`;

            scaleSlider.style.cssText = 'width: 120px; cursor: pointer;';

            scaleSection.appendChild(scaleLabel);
            scaleSection.appendChild(scaleValueDisplay);
            scaleSection.appendChild(scaleSlider);

            // === Section 3: Hover-Animation deaktivieren ===
            const hoverSection = document.createElement('div');
            hoverSection.style.cssText = 'display: flex; align-items: center; gap: 6px; padding: 4px 12px; border: 1px solid #000; border-radius: 4px; margin-right: 8px;';

            const hoverCheckbox = document.createElement('input');
            hoverCheckbox.type = 'checkbox';
            hoverCheckbox.checked = hoverAnimationDisabled;
            hoverCheckbox.style.cssText = 'cursor: pointer;';

            const hoverLabel = document.createElement('label');
            hoverLabel.textContent = 'Hover-Animation deaktivieren';
            hoverLabel.style.cssText = 'font-weight: normal; font-size: 14px; cursor: pointer; user-select: none; white-space: nowrap;';

            hoverSection.appendChild(hoverCheckbox);
            hoverSection.appendChild(hoverLabel);

            // === Section 4: Vergleichsmodus ===
            const comparisonSection = document.createElement('div');
            comparisonSection.style.cssText = 'display: flex; align-items: center; gap: 12px; padding: 4px 12px; border: 1px solid #000; border-radius: 4px;';

            // Comparison Mode Toggle
            const comparisonLabel = document.createElement('label');
            comparisonLabel.style.cssText = 'display: inline-flex; align-items: center; cursor: pointer; user-select: none; gap: 8px; white-space: nowrap;';

            const comparisonText = document.createElement('span');
            comparisonText.textContent = 'Vergleichsmodus';
            comparisonText.style.cssText = 'font-weight: normal; font-size: 14px;';

            const comparisonToggleSwitch = document.createElement('div');
            comparisonToggleSwitch.style.cssText = `
                position: relative;
                width: 44px;
                height: 24px;
                background: #ccc;
                border-radius: 12px;
                cursor: pointer;
                transition: background 0.3s;
                flex-shrink: 0;
            `;

            const comparisonToggleSlider = document.createElement('div');
            comparisonToggleSlider.style.cssText = `
                position: absolute;
                top: 2px;
                left: 2px;
                width: 20px;
                height: 20px;
                background: white;
                border-radius: 50%;
                transition: transform 0.3s;
                transform: translateX(0);
            `;

            comparisonToggleSwitch.appendChild(comparisonToggleSlider);
            comparisonLabel.appendChild(comparisonText);
            comparisonLabel.appendChild(comparisonToggleSwitch);

            // Compare Button
            const compareBtn = document.createElement('button');
            compareBtn.id = 'compare-button';
            compareBtn.textContent = 'Vergleich';
            compareBtn.disabled = true;
            compareBtn.style.cssText = 'padding: 4px 12px; border: 1px solid #0d6efd; border-radius: 4px; font-size: 14px; background: #0d6efd; color: white; cursor: not-allowed; opacity: 0.5; transition: opacity 0.2s;';

            comparisonSection.appendChild(comparisonLabel);
            comparisonSection.appendChild(compareBtn);

            // Comparison Toggle Click Handler
            comparisonToggleSwitch.onclick = () => {
                try {
                    comparisonModeActive = !comparisonModeActive;

                    if (comparisonModeActive) {
                        comparisonToggleSwitch.style.background = '#4CAF50';
                        comparisonToggleSlider.style.transform = 'translateX(20px)';
                    } else {
                        comparisonToggleSwitch.style.background = '#ccc';
                        comparisonToggleSlider.style.transform = 'translateX(0)';
                        if (comparisonViewActive) {
                            deactivateComparisonView();
                        } else {
                            clearAllSelections();
                        }
                    }

                    setupImageClickHandlers();
                    updateAllImagesGrayscale();
                } catch (e) {
                    // Silent fail
                }
            };

            // Compare Button Click Handler
            compareBtn.onclick = () => {
                try {
                    if (comparisonViewActive) {
                        deactivateComparisonView();
                    } else if (selectedImages.size > 0) {
                        activateComparisonView();
                    }
                } catch (e) {
                    // Silent fail
                }
            };

            // Toggle Click Handler
            toggleSwitch.onclick = () => {
                try {
                    galleryModeActive = !galleryModeActive;
                    hiddenCheckbox.checked = galleryModeActive;

                    if (galleryModeActive) {
                        toggleSwitch.style.background = '#4CAF50';
                        toggleSlider.style.transform = 'translateX(20px)';
                        controlsContainer.style.display = 'flex';
                    } else {
                        toggleSwitch.style.background = '#ccc';
                        toggleSlider.style.transform = 'translateX(0)';
                        controlsContainer.style.display = 'none';
                        // Deactivate comparison mode when gallery mode is turned off
                        if (comparisonModeActive) {
                            comparisonModeActive = false;
                            comparisonToggleSwitch.style.background = '#ccc';
                            comparisonToggleSlider.style.transform = 'translateX(0)';
                            if (comparisonViewActive) {
                                deactivateComparisonView();
                            } else {
                                clearAllSelections();
                            }
                        }
                    }

                    toggleGalleryMode();
                } catch (e) {
                    // Silent fail
                }
            };

            // Event Handlers
            rangeInput.oninput = () => {
                try {
                    const value = rangeInput.value.trim();
                    if (value === '') {
                        imageRangeFilter = null;
                    } else {
                        imageRangeFilter = parseImageRange(value);
                    }
                    if (galleryModeActive) {
                        activateGalleryMode();
                    }
                } catch (e) {
                    // Silent fail
                }
            };

            scaleSlider.oninput = () => {
                try {
                    const index = parseInt(scaleSlider.value);
                    imageScale = scaleValues[index];
                    userSetImageScale = imageScale; // User manually changed the scale
                    scaleValueDisplay.textContent = `${imageScale}%`;
                    if (galleryModeActive) {
                        if (comparisonViewActive) {
                            updateComparisonViewScale();
                        } else {
                            activateGalleryMode();
                        }
                    }
                } catch (e) {
                    // Silent fail
                }
            };

            hoverCheckbox.onchange = () => {
                try {
                    hoverAnimationDisabled = hoverCheckbox.checked;
                    if (galleryModeActive) {
                        if (hoverAnimationDisabled) {
                            removeImageHoverZoom();
                        } else {
                            setupImageHoverZoom();
                        }
                    }
                } catch (e) {
                    // Silent fail
                }
            };

            // Append sections to controls container
            controlsContainer.appendChild(filterSection);
            controlsContainer.appendChild(scaleSection);
            controlsContainer.appendChild(hoverSection);
            controlsContainer.appendChild(comparisonSection);

            // Append to main container
            toggleContainer.appendChild(label);
            toggleContainer.appendChild(hiddenCheckbox);
            toggleContainer.appendChild(controlsContainer);

            const parentDiv = header.parentElement;
            if (parentDiv) {
                parentDiv.insertBefore(toggleContainer, header);
            }

            // If auto-gallery is enabled, initialize the controls and activate
            if (autoGalleryEnabled) {
                toggleGalleryMode();
            }
        } catch (e) {
            // Silent fail
        }
    }

    function toggleGalleryMode() {
        try {
            if (galleryModeActive) {
                activateGalleryMode();
            } else {
                deactivateGalleryMode();
            }
        } catch (e) {
            // Silent fail
        }
    }

    function activateGalleryMode() {
        try {
            if (!styleElement) {
                styleElement = document.createElement('style');
                styleElement.id = 'gallery-mode-styles';
                document.head.appendChild(styleElement);
            }

            const scaledSize = Math.round(baseWidth * (imageScale / 100));
            const scaledHeight = Math.round(baseHeight * (imageScale / 100));

            styleElement.textContent = `
                .d-grid.gap-2.ps-2 {
                    display: flex !important;
                    flex-direction: column !important;
                    gap: 0.5rem !important;
                    padding-left: 0.5rem !important;
                }
                .d-grid.gap-2.ps-2 > .fs-2.text-secondary.fw-light {
                    display: none !important;
                }
                .d-grid.gap-2.ps-2 > div:first-child {
                    display: none !important;
                }
                .d-grid.gap-2.ps-2 > .position-relative {
                    width: 100% !important;
                }
                .d-flex.align-items-start.justify-content-between.position-sticky {
                    min-height: 58px !important;
                }
                .d-flex.align-items-start.justify-content-between.position-sticky h4,
                .d-flex.align-items-start.justify-content-between.position-sticky .d-flex.align-items-start,
                .d-flex.align-items-start.justify-content-between.position-sticky .d-flex.align-items-center:last-child {
                    display: none !important;
                }
                .btn-outline-danger[type="button"]:not(.article-delete-btn) {
                    display: none !important;
                }
                .fade.bg-secondary-subtle {
                    display: none !important;
                }
                .bg-white.p-1 .d-flex.justify-content-between.align-items-start {
                    justify-content: flex-start !important;
                    gap: 0 !important;
                }
                .bg-white.p-1 .d-flex.justify-content-between.align-items-start .btn-group {
                    margin-left: auto !important;
                }
            `;

            const products = document.querySelectorAll('.bg-white.p-1');
            products.forEach(product => {
                try {
                    const imageContainer = product.querySelector('.d-flex.gap-2.my-2');
                    if (!imageContainer) return;

                    const images = imageContainer.querySelectorAll('img');
                    if (images.length === 0) return;

                    imageContainer.style.cssText = 'display: flex; flex-wrap: wrap; gap: 16px; margin: 16px 0;';

                    images.forEach((img, index) => {
                        try {
                            const wrapper = img.closest('.p-2.position-relative.border');
                            if (!wrapper) return;

                            const imageNumber = index + 1;
                            let shouldShow = true;

                            if (imageRangeFilter !== null) {
                                shouldShow = imageRangeFilter.has(imageNumber);
                            }

                            if (!shouldShow) {
                                wrapper.style.display = 'none';
                            } else {
                                wrapper.style.cssText = 'padding: 8px; position: relative; border: 1px solid #dee2e6; background: white;';
                                img.style.cssText = `display: block; max-width: ${scaledSize}px; max-height: ${scaledHeight}px; width: auto; height: auto; z-index: 4;`;

                                // Restore selection outline if in comparison mode
                                if (comparisonModeActive && selectedImages.has(getImageId(img))) {
                                    wrapper.style.outline = '3px solid #0d6efd';
                                    wrapper.style.outlineOffset = '2px';
                                }

                                // Update grayscale
                                updateImageGrayscale(img, wrapper);
                            }
                        } catch (e) {
                            // Silent fail
                        }
                    });
                } catch (e) {
                    // Silent fail
                }
            });

            setupImageHoverZoom();
            setupImageClickHandlers();
        } catch (e) {
            // Silent fail
        }
    }

    function deactivateGalleryMode() {
        try {
            if (styleElement) {
                styleElement.remove();
                styleElement = null;
            }

            removeImageHoverZoom();

            const products = document.querySelectorAll('.bg-white.p-1');
            products.forEach(product => {
                try {
                    const imageContainer = product.querySelector('.d-flex.gap-2.my-2');
                    if (!imageContainer) return;

                    const images = imageContainer.querySelectorAll('img');

                    imageContainer.style.cssText = '';

                    images.forEach(img => {
                        try {
                            const wrapper = img.closest('.p-2.position-relative.border');
                            if (wrapper) {
                                wrapper.style.cssText = '';
                                wrapper.style.display = '';
                                wrapper.onclick = null;
                                img.style.cssText = 'z-index: 4; max-width: 2.4rem; max-height: 3rem;';
                                // Remove grayscale
                                img.style.filter = '';
                                img.style.opacity = '';
                            }
                        } catch (e) {
                            // Silent fail
                        }
                    });
                } catch (e) {
                    // Silent fail
                }
            });
        } catch (e) {
            // Silent fail
        }
    }

    function init() {
        try {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    try {
                        createToggleButton();
                    } catch (e) {
                        // Silent fail
                    }
                });
            } else {
                createToggleButton();
            }

            const observer = new MutationObserver(function(mutations) {
                try {
                    if (!document.getElementById('gallery-mode-toggle')) {
                        createToggleButton();
                    }
                } catch (e) {
                    // Silent fail
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        } catch (e) {
            // Silent fail
        }
    }

    init();
})();