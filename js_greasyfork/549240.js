// ==UserScript==
// @name         nhentai Long Strip Mode
// @namespace    http://tampermonkey.net/
// @version      1.3.4
// @description  Add Long Strip (webtoon) mode to nhentai reader
// @author       GrennKren
// @license Unlicense
// @match        https://nhentai.net/g/*
// @match        https://nhentai.net/g/*/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/549240/nhentai%20Long%20Strip%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/549240/nhentai%20Long%20Strip%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let longStripMode = false;
	let allImagesLoaded = false;
	let imageLoadingMode = 'lazy'; // 'lazy', 'sequential' . Default to lazy, will be overridden by settings

	// CDN Configuration
	const CDN_CONFIG = {
		original_cdns: null,
		get primary_cdns() {
			return (window._n_app && window._n_app.options && window._n_app.options.image_cdn_urls) || ["i1.nhentai.net", "i2.nhentai.net", "i4.nhentai.net", "i9.nhentai.net"];
		},
		fallback_cdn: "i.nhentai.net",
		selected_cdn: null
	};

	// Initialize CDN selection (deterministic, consistent across refreshes)
	function initializeCDN() {
	    if (CDN_CONFIG.selected_cdn) return CDN_CONFIG.selected_cdn;

	    // Save original CDNs
	    CDN_CONFIG.original_cdns = CDN_CONFIG.primary_cdns.slice();

	    // Use gallery ID to deterministically select CDN (consistent across refreshes)
	    const match = window.location.pathname.match(/\/g\/(\d+)/);
		const galleryId = match ? match[1] : null;
	    if (galleryId) {
	        const availableCDNs = CDN_CONFIG.primary_cdns;
	        const index = parseInt(galleryId) % availableCDNs.length;
	        CDN_CONFIG.selected_cdn = availableCDNs[index];
	    } else {
	        // Fallback to first CDN if no gallery ID found
	        CDN_CONFIG.selected_cdn = CDN_CONFIG.primary_cdns[0];
	    }

	    console.log(`[nhentai Long Strip] Selected CDN: ${CDN_CONFIG.selected_cdn}`);
	    console.log(`[nhentai Long Strip] Available CDNs:`, CDN_CONFIG.primary_cdns);
	    return CDN_CONFIG.selected_cdn;
	}

	// Get image URL with CDN fallback mechanism
	function getImageURLWithFallback(galleryId, page, extension, cdnIndex = 0) {
		const cdnList = [...CDN_CONFIG.primary_cdns, CDN_CONFIG.fallback_cdn];

		// Always use the available CDNs from the list
		if (cdnIndex < cdnList.length) {
			return `https://${cdnList[cdnIndex]}/galleries/${galleryId}/${page}.${extension}`;
		}

		// Final fallback
		return `https://${CDN_CONFIG.fallback_cdn}/galleries/${galleryId}/${page}.${extension}`;
	}

	// Calculate responsive dimensions based on viewport
	function calculateResponsiveDimensions(originalWidth, originalHeight, zoomLevel = 100) {
	    const viewportWidth = window.innerWidth;
	    const viewportHeight = window.innerHeight;
	    const zoomRatio = zoomLevel / 100;

	    // Calculate what the image size would be at current zoom
	    const targetWidth = originalWidth * zoomRatio;
	    const targetHeight = originalHeight * zoomRatio;

	    // For 100% zoom (normal), fit to viewport width but don't exceed original size
	    if (zoomLevel === 100) {
	        if (originalWidth > viewportWidth) {
	            // If image is wider than viewport, scale down to fit viewport width
	            const scale = viewportWidth / originalWidth;
	            return {
	                width: viewportWidth,
	                height: originalHeight * scale,
	                scale: scale
	            };
	        } else {
	            // If image fits in viewport, use original size
	            return {
	                width: originalWidth,
	                height: originalHeight,
	                scale: 1
	            };
	        }
	    } else {
	        // For other zoom levels, apply zoom to the base responsive size
	        const baseScale = originalWidth > viewportWidth ? viewportWidth / originalWidth : 1;
	        const finalScale = baseScale * zoomRatio;

	        return {
	            width: originalWidth * finalScale,
	            height: originalHeight * finalScale,
	            scale: finalScale
	        };
	    }
	}

	// Load image with fallback mechanism
	function loadImageWithFallback(galleryId, page, extension, retryCount = 0) {
	    return new Promise((resolve, reject) => {
	        const img = new Image();
	        const maxRetries = CDN_CONFIG.primary_cdns.length + 1; // +1 for final fallback

	        img.onload = function() {
	            if (retryCount > 0) {
	                console.log(`[nhentai Long Strip] Page ${page} loaded successfully with fallback ${retryCount}`);
	            }
	            resolve({
	                success: true,
	                img: this,
	                page
	            });
	        };

	        img.onerror = function() {
	            if (retryCount < maxRetries) {
	                console.log(`[nhentai Long Strip] Page ${page} failed on attempt ${retryCount + 1}, trying fallback...`);
	                // Try next CDN
	                loadImageWithFallback(galleryId, page, extension, retryCount + 1)
	                    .then(result => resolve(result)) // Pass through resolve with result
	                    .catch(error => reject(error));
	            } else {
	                console.error(`[nhentai Long Strip] Page ${page} failed to load from all CDNs`);
	                reject(new Error(`Failed to load page ${page} from all available CDNs`));
	            }
	        };

	        img.src = getImageURLWithFallback(galleryId, page, extension, retryCount);
	        img.alt = `Page ${page}`;
	        img.dataset.page = page;

	        // Set initial styles - let CSS handle the responsiveness
	        img.style.cssText = `
	            max-width: 100%;
	            height: auto;
	            display: none;
	            object-fit: contain;
	        `;

	        // Use img.decode() if available to ensure full decoding before resolving
	        if ('decode' in img) {
	            img.decode()
	                .then(() => {
	                    resolve({
	                        success: true,
	                        img: img,
	                        page
	                    });
	                })
	                .catch((decodeError) => {
	                    // If decode fails, trigger error handling
	                    if (retryCount < maxRetries) {
	                        console.log(`[nhentai Long Strip] Page ${page} decode failed, trying fallback...`);
	                        loadImageWithFallback(galleryId, page, extension, retryCount + 1)
	                            .then(result => resolve(result))
	                            .catch(error => reject(error));
	                    } else {
	                        reject(decodeError);
	                    }
	                });
	        }
	        // If decode not supported, rely on onload (as before)
	    });
	}

	// Load images lazily using Intersection Observer
	async function loadLazyImages(galleryId, wrappers) {
		const imageObserver = new IntersectionObserver((entries, observer) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					const page = parseInt(entry.target.dataset.page);
					loadImageAsync(galleryId, page, entry.target);
					observer.unobserve(entry.target);
				}
			});
		}, { rootMargin: '50px 0px' }); // Trigger when 50px from viewport

		wrappers.forEach(wrapper => {
			imageObserver.observe(wrapper.imageWrapper);
		});

		// Load first few images immediately
		for (let i = 0; i < Math.min(3, wrappers.length); i++) {
			const page = wrappers[i].i;
			await loadImageAsync(galleryId, page, wrappers[i].imageWrapper);
		}
	}

	async function loadImageAsync(galleryId, page, imageWrapper) {
		try {
			const pageData = window.reader.gallery.images.pages[page - 1];
			const extension = pageData.extension || 'webp';
			const result = await loadImageWithFallback(galleryId, page, extension);
			if (result.success) {
				const imagePlaceholder = imageWrapper.querySelector('.image-placeholder');
				imagePlaceholder.remove();

				// Apply current zoom level with responsive behavior
				const settings = window.reader.get_settings();
				const dimensions = calculateResponsiveDimensions(pageData.width, pageData.height, settings.zoom);

				result.img.style.width = dimensions.width + 'px';
				result.img.style.height = dimensions.height + 'px';
				result.img.style.margin = '0';
				result.img.style.padding = '0';
				result.img.style.display = 'block';

				// Handle horizontal overflow if needed
				if (dimensions.width > window.innerWidth || settings.zoom > 100) {
					imageWrapper.style.overflowX = 'auto';
					result.img.style.maxWidth = 'none';
				} else {
					imageWrapper.style.overflowX = 'visible';
					result.img.style.maxWidth = '100%';
				}

				imageWrapper.appendChild(result.img);
				console.log(`[nhentai Long Strip] Page ${page} loaded lazily`);
			}
		} catch (error) {
			console.error(`[nhentai Long Strip] Page ${page} failed:`, error);
			const imagePlaceholder = imageWrapper.querySelector('.image-placeholder');
			imagePlaceholder.innerHTML = `
				<div style="color: #ff6b6b; text-align: center;">
					<div style="font-size: 20px; margin-bottom: 5px;">⚠</div>
					<div>Failed to load Page ${page}</div>
					<div style="font-size: 12px; margin-top: 5px; cursor: pointer;" onclick="window.location.reload()">
						Click to reload page
					</div>
				</div>
			`;
		}
	}

	// Get page position for long strip mode
	function getPagePosition(pageNumber) {
	    const container = document.querySelector('#long-strip-container');
	    if (!container) return 0;

	    const imgElement = container.querySelector(`img[data-page="${pageNumber}"]`);
		const imageWrapper = imgElement ? imgElement.parentElement : null;

	    if (!imageWrapper) return 0;

	    return imageWrapper.offsetTop;
	}

	// Scroll to specific page in long strip mode
	function scrollToPage(pageNumber) {
	    const position = getPagePosition(pageNumber);
	    window.scrollTo({ top: position, behavior: 'smooth' });
	}

	// Apply zoom to all images in long strip mode with responsive behavior
	function applyLongStripZoom(zoomLevel) {
	    const container = document.querySelector('#long-strip-container');
	    if (!container) return;

	    const images = container.querySelectorAll('img');
	    images.forEach(img => {
	        const pageData = window.reader.gallery.images.pages[parseInt(img.dataset.page) - 1];
	        if (pageData) {
	            const dimensions = calculateResponsiveDimensions(pageData.width, pageData.height, zoomLevel);

	            // Apply calculated dimensions
	            img.style.width = dimensions.width + 'px';
	            img.style.height = dimensions.height + 'px';
	            img.style.maxWidth = 'none'; // Override max-width when zoomed
	            img.style.margin = '0';
	            img.style.padding = '0';

	            // If image exceeds viewport at current zoom, enable scrolling
	            const wrapper = img.parentElement;
	            if (dimensions.width > window.innerWidth || zoomLevel > 100) {
	                wrapper.style.overflowX = 'auto';
	                wrapper.style.width = '100vw';
	            } else {
	                wrapper.style.overflowX = 'visible';
	                wrapper.style.width = 'auto';
	            }
	        }
	    });
	}

	// Wait for the page to load and reader to be available
	function waitForReader(callback) {
	    if (window.reader) {
	        callback();
	    } else {
	        setTimeout(() => waitForReader(callback), 100);
	    }
	}

	// Add responsive styles
	function addResponsiveStyles() {
	    if (document.getElementById('long-strip-responsive-styles')) return;

	    const style = document.createElement('style');
	    style.id = 'long-strip-responsive-styles';
	    style.textContent = `
	        #long-strip-container {
	            width: 100%;
	            max-width: 100vw;
	        }

	        #long-strip-container .image-wrapper {
	            width: 100%;
	            max-width: 100vw;
	            overflow-x: auto;
	            display: flex;
	            justify-content: center;
	            position: relative;
	        }

	        #long-strip-container img {
	            display: block !important;
	            height: auto;
	            object-fit: contain;
	        }

	        /* Scrollbar styling for horizontal overflow */
	        #long-strip-container .image-wrapper::-webkit-scrollbar {
	            height: 8px;
	        }

	        #long-strip-container .image-wrapper::-webkit-scrollbar-track {
	            background: #f1f1f1;
	            border-radius: 4px;
	        }

	        #long-strip-container .image-wrapper::-webkit-scrollbar-thumb {
	            background: #888;
	            border-radius: 4px;
	        }

	        #long-strip-container .image-wrapper::-webkit-scrollbar-thumb:hover {
	            background: #555;
	        }
	    `;
	    document.head.appendChild(style);
	}

	// Override the reader's get_settings method to include our new mode
	function enhanceReaderSettings() {
	    if (!window.reader) return;

	    // Initialize CDN selection
	    initializeCDN();

	    // Add responsive styles
	    addResponsiveStyles();

	    const originalGetSettings = window.reader.get_settings.bind(window.reader);
	    const originalSetSettings = window.reader.set_settings.bind(window.reader);
	    const originalApplySettings = window.reader.apply_settings.bind(window.reader);
	    const originalPreviousPage = window.reader.previous_page.bind(window.reader);
	    const originalNextPage = window.reader.next_page.bind(window.reader);
	    const originalZoomBy = window.reader.zoom_by.bind(window.reader);

	    // Override get_settings to read long_strip_mode and image_loading_mode from localStorage
	    window.reader.get_settings = function() {
	        const settings = originalGetSettings();
	        settings.long_strip_mode = localStorage.getItem('nhentai_long_strip_mode') === 'true';
			settings.image_loading_mode = localStorage.getItem('nhentai_image_loading_mode') || 'sequential';
	        return settings;
	    };

	    // Override previous_page for long strip mode
	    window.reader.previous_page = function(t) {
	        if (longStripMode) {
	            const jumpPages = t || 1;
	            const targetPage = Math.max(1, this.current_page - jumpPages);
	            scrollToPage(targetPage);
	            this.current_page = targetPage;
	        } else {
	            originalPreviousPage.call(this, t);
	        }
	    };

	    // Override next_page for long strip mode
	    window.reader.next_page = function(t) {
	        if (longStripMode) {
	            const jumpPages = t || 1;
	            const targetPage = Math.min(this.gallery.num_pages, this.current_page + jumpPages);
	            scrollToPage(targetPage);
	            this.current_page = targetPage;
	        } else {
	            originalNextPage.call(this, t);
	        }
	    };

	    // Override zoom_by to support values below 1.0x and handle long strip mode
	    window.reader.zoom_by = function(t, e, n) {
	        const settings = this.get_settings();
	        const minZoom = e || 40; // Changed minimum to 40%
	        const maxZoom = n || 300;

	        settings.zoom = Math.max(minZoom, Math.min(settings.zoom + t, maxZoom));
	        this.set_settings(settings);

	        if (longStripMode) {
	            applyLongStripZoom(settings.zoom);
	        } else {
	            this.apply_settings();
	        }

	        // Update zoom level display
	        const zoomDisplay = document.querySelector('.zoom-level .value');
	        if (zoomDisplay) {
	            zoomDisplay.textContent = (settings.zoom / 100).toFixed(1);
	        }
	    };

	    // Override apply_settings to handle long strip mode and image loading mode
	    window.reader.apply_settings = function() {
	        const settings = this.get_settings();
	        longStripMode = settings.long_strip_mode;
			imageLoadingMode = settings.image_loading_mode;

	        if (longStripMode) {
	            this.enableLongStripMode();
	        } else {
	            this.disableLongStripMode();
	        }

	        originalApplySettings.call(this);

	        // Update zoom display
	        const zoomDisplay = document.querySelector('.zoom-level .value');
	        if (zoomDisplay) {
	            zoomDisplay.textContent = (settings.zoom / 100).toFixed(1);
	        }
	    };

	    // Sequential load images and attach to containers
	    async function loadSequentialImages(galleryId, totalImages, wrappers) {
	        for (let i = 1; i <= totalImages; i++) {
	            try {
	                const pageData = window.reader.gallery.images.pages[i - 1];
	                const extension = pageData.extension || 'webp';
	                const wrapper = wrappers[i - 1];

	                const result = await loadImageWithFallback(galleryId, i, extension);
	                if (result.success) {
	                    const imageWrapper = wrapper.imageWrapper;
	                    const imagePlaceholder = imageWrapper.querySelector('.image-placeholder');
	                    imagePlaceholder.remove();

	                    // Apply current zoom level with responsive behavior
	                    const settings = window.reader.get_settings();
	                    const dimensions = calculateResponsiveDimensions(pageData.width, pageData.height, settings.zoom);

	                    result.img.style.width = dimensions.width + 'px';
	                    result.img.style.height = dimensions.height + 'px';
	                    result.img.style.margin = '0';
	                    result.img.style.padding = '0';
	                    result.img.style.display = 'block';

	                    // Handle horizontal overflow if needed
	                    if (dimensions.width > window.innerWidth || settings.zoom > 100) {
	                        imageWrapper.style.overflowX = 'auto';
	                        result.img.style.maxWidth = 'none';
	                    } else {
	                        imageWrapper.style.overflowX = 'visible';
	                        result.img.style.maxWidth = '100%';
	                    }

	                    imageWrapper.appendChild(result.img);
	                    console.log(`[nhentai Long Strip] Page ${i} loaded sequentially`);
	                }
	            } catch (error) {
	                console.error(`[nhentai Long Strip] Page ${i} failed:`, error);
	                const wrapper = wrappers[i - 1];
	                const imageWrapper = wrapper.imageWrapper;
	                const imagePlaceholder = imageWrapper.querySelector('.image-placeholder');
	                imagePlaceholder.innerHTML = `
	                    <div style="color: #ff6b6b; text-align: center;">
	                        <div style="font-size: 20px; margin-bottom: 5px;">⚠</div>
	                        <div>Failed to load Page ${i}</div>
	                        <div style="font-size: 12px; margin-top: 5px; cursor: pointer;" onclick="window.location.reload()">
	                            Click to reload page
	                        </div>
	                    </div>
	                `;
	            }
	        }
	    }

	    // Add long strip mode functionality
	    window.reader.enableLongStripMode = function() {
	        if (allImagesLoaded) return;

	        // Override CDNs to use only the selected one to prevent inconsistencies with site's random selection
	        //window._n_app.options.image_cdn_urls = [CDN_CONFIG.selected_cdn];

	        // Disable preloading to avoid concurrent loading
	        const settings = this.get_settings();
	        const originalPreload = settings.preload;
	        settings.preload = 0; // Disable preloading
	        this.set_settings(settings);

	        const imageContainer = document.querySelector('#image-container');
	        const gallery = this.gallery;

	        // Hide pagination controls in long strip mode
	        document.querySelectorAll('.reader-pagination').forEach(el => {
	            el.style.display = 'none';
	        });

	        // Create container for all images
	        const longStripContainer = document.createElement('div');
	        longStripContainer.id = 'long-strip-container';
	        longStripContainer.style.cssText = `
	            display: flex;
	            flex-direction: column;
	            align-items: center;
	            gap: 0px;
	            width: 100%;
	            max-width: 100vw;
	        `;

	        // Add CSS animation for spinner if not present
	        if (!document.getElementById('spinner-style')) {
	            const style = document.createElement('style');
	            style.id = 'spinner-style';
	            style.textContent = `
	                @keyframes spin {
	                    0% { transform: rotate(0deg); }
	                    100% { transform: rotate(360deg); }
	                }
	            `;
	            document.head.appendChild(style);
	        }

	        const totalImages = gallery.num_pages;
	        const galleryId = gallery.media_id;
	        const wrappers = [];

	        // Create all wrappers first (synchronously)
	        for (let i = 1; i <= gallery.num_pages; i++) {
	            // Create image wrapper with placeholder
	            const imageWrapper = document.createElement('div');
	            imageWrapper.style.cssText = `
	                position: relative;
	                width: 100%;
	                max-width: 100vw;
	                display: flex;
	                justify-content: center;
	                align-items: center;
	                min-height: 200px;
	                background: #f0f0f0;
	                margin: 0;
	                padding: 0;
	                overflow-x: auto;
	            `;
				imageWrapper.dataset.page = i;

	            // Create placeholder spinner for each image
	            const imagePlaceholder = document.createElement('div');
	            imagePlaceholder.className = 'image-placeholder'; // Add class for selector
	            imagePlaceholder.style.cssText = `
	                display: flex;
	                flex-direction: column;
	                align-items: center;
	                justify-content: center;
	                height: 200px;
	                color: #666;
	            `;

	            const imageSpinner = document.createElement('div');
	            imageSpinner.style.cssText = `
	                width: 30px;
	                height: 30px;
	                border: 3px solid #ddd;
	                border-top: 3px solid #666;
	                border-radius: 50%;
	                animation: spin 1s linear infinite;
	                margin-bottom: 10px;
	            `;

	            const pageText = document.createElement('div');
	            pageText.textContent = `Page ${i}`;
	            pageText.style.fontSize = '14px';

	            imagePlaceholder.appendChild(imageSpinner);
	            imagePlaceholder.appendChild(pageText);
	            imageWrapper.appendChild(imagePlaceholder);

	            imageWrapper.classList.add('image-wrapper');
	            longStripContainer.appendChild(imageWrapper);
	            wrappers.push({ imageWrapper, i });
	        }

	        // Replace current image with long strip container
	        imageContainer.innerHTML = '';
	        imageContainer.appendChild(longStripContainer);

			// Choose loading method based on setting
			if (imageLoadingMode === 'lazy') {
				loadLazyImages(galleryId, wrappers);
			} else {
				loadSequentialImages(galleryId, totalImages, wrappers);
			}

	        allImagesLoaded = true;

	        // Add window resize handler for responsive behavior
	        window.addEventListener('resize', () => {
	            if (longStripMode) {
	                const currentSettings = this.get_settings();
	                setTimeout(() => applyLongStripZoom(currentSettings.zoom), 100);
	            }
	        });
	    };

	    window.reader.disableLongStripMode = function() {
			if (!allImagesLoaded) {
				// If we are already in normal mode, ensure pagination is visible
				document.querySelectorAll('.reader-pagination').forEach(el => {
					el.style.display = '';
				});
				return;
			}

	        // Restore original CDNs
	        // window._n_app.options.image_cdn_urls = CDN_CONFIG.original_cdns;

	        // Restore original preload setting
	        const settings = this.get_settings();
	        const originalPreload = settings.preload;

	        if (this.originalPreload !== undefined) {
	            settings.preload = this.originalPreload;
	            this.set_settings(settings);
	        }

	        const imageContainer = document.querySelector('#image-container');

	        // Show pagination controls
	        document.querySelectorAll('.reader-pagination').forEach(el => {
	            el.style.display = '';
	        });

	        // Restore original image
	        const currentPageImage = this.get_image(this.current_page);
	        imageContainer.innerHTML = '';
	        const link = document.createElement('a');
	        link.href = this.get_page_url(this.current_page + 1);
	        link.appendChild(currentPageImage.image);
	        imageContainer.appendChild(link);

	        allImagesLoaded = false;
	    };

	    // Helper method to get image URL (updated to use CDN system)
	    window.reader.get_image_url = function(page, pageData) {
	        const mediaId = this.gallery.media_id;
	        const extension = pageData.extension || 'webp';
	        return getImageURLWithFallback(mediaId, page, extension, 0);
	    };
	}

	// Modify the settings modal to include long strip option
	function addLongStripToSettings() {
	    const checkForSettings = setInterval(() => {
	        const settingsButton = document.querySelector('.reader-settings');
	        if (settingsButton) {
	            clearInterval(checkForSettings);

	            const newButton = settingsButton.cloneNode(true);
	            settingsButton.parentNode.replaceChild(newButton, settingsButton);

	            newButton.addEventListener('click', function(e) {
	                e.preventDefault();
	                e.stopPropagation();
	                e.stopImmediatePropagation();

	                const existingModals = document.querySelectorAll('.modal-wrapper');
	                existingModals.forEach(modal => modal.remove());

	                showEnhancedSettingsModal();
	            });
	        }
	    }, 100);

	    // Also override zoom buttons to work with our extended range
	    const checkForZoomButtons = setInterval(() => {
	        const zoomInBtn = document.querySelector('.reader-zoom-in');
	        const zoomOutBtn = document.querySelector('.reader-zoom-out');

	        if (zoomInBtn && zoomOutBtn) {
	            clearInterval(checkForZoomButtons);

	            // Clone and replace zoom in button
	            const newZoomInBtn = zoomInBtn.cloneNode(true);
	            zoomInBtn.parentNode.replaceChild(newZoomInBtn, zoomInBtn);
	            newZoomInBtn.addEventListener('click', function() {
	                window.reader.zoom_by(20, 40, 300);
	            });

	            // Clone and replace zoom out button
	            const newZoomOutBtn = zoomOutBtn.cloneNode(true);
	            zoomOutBtn.parentNode.replaceChild(newZoomOutBtn, zoomOutBtn);
	            newZoomOutBtn.addEventListener('click', function() {
	                window.reader.zoom_by(-20, 40, 300);
	            });
	        }
	    }, 100);
	}

	function showEnhancedSettingsModal() {
	    if (!window.reader) return;

	    const settings = window.reader.get_settings();

	    const modalHTML = `
	        <div class="modal-wrapper fade-slide-in open" id="enhanced-settings-modal">
	            <div class="modal-inner">
	                <h1>Reader Settings</h1>
	                <div class="contents">
	                    <div id="reader-settings">
	                        <label>Reading Mode
	                            <select class="control" data-setting="long_strip_mode">
	                                <option value="false">Normal (Page by Page)</option>
	                                <option value="true">Long Strip (Webtoon)</option>
	                            </select>
	                        </label>
	                        <label>Image Loading Mode (Long Strip Only)
	                            <select class="control" data-setting="image_loading_mode">
	                                <option value="sequential">Sequential (Load all at once)</option>
	                                <option value="lazy">Lazy Loading (Load on scroll)</option>
	                            </select>
	                        </label>
	                        <label>Image Preloading
	                            <select class="control" data-setting="preload">
	                                <option value="0">Disabled</option>
	                                <option value="1">1 page</option>
	                                <option value="2">2 pages</option>
	                                <option value="3">3 pages</option>
	                                <option value="4">4 pages</option>
	                                <option value="5">5 pages</option>
	                            </select>
	                        </label>
	                        <label>Page Turning
	                            <select class="control" data-setting="turning_behavior">
	                                <option value="left">Left half</option>
	                                <option value="right">Right half</option>
	                                <option value="both">Entire image</option>
	                            </select>
	                        </label>
	                        <label>Image Scaling
	                            <select class="control" data-setting="image_scaling">
	                                <option value="fit-horizontal">Fit horizontally</option>
	                                <option value="fit-both">Fit on screen</option>
	                            </select>
	                        </label>
	                        <label>Zoom
	                            <select class="control" data-setting="zoom">
	                                <option value="40">40%</option>
	                                <option value="60">60%</option>
	                                <option value="80">80%</option>
	                                <option value="100">100% (Viewport Fit)</option>
	                                <option value="120">120%</option>
	                                <option value="140">140%</option>
	                                <option value="160">160%</option>
	                                <option value="180">180%</option>
	                                <option value="200">200%</option>
	                                <option value="220">220%</option>
	                                <option value="240">240%</option>
	                                <option value="260">260%</option>
	                                <option value="280">280%</option>
	                                <option value="300">300%</option>
	                            </select>
	                        </label>
	                        <label>Jump on Page Turn
	                            <select class="control" data-setting="jump_on_turn">
	                                <option value="image">Top of image</option>
	                                <option value="controls">Top of controls</option>
	                                <option value="none">Don't jump</option>
	                            </select>
	                        </label>
	                        <label>Scroll Speed
	                            <input class="control" type="range" min="1" max="20" step="1" data-setting="scroll_speed" />
	                        </label>

	                        <p>
	                            <h2>Keyboard Shortcuts</h2>
	                            <table>
	                                <tr>
	                                    <td><code>W</code>, <code>↑</code></td>
	                                    <td>Scroll up</td>
	                                </tr>
	                                <tr>
	                                    <td><code>A</code>, <code>←</code></td>
	                                    <td>Back one page (Long Strip: scroll to previous page)</td>
	                                </tr>
	                                <tr>
	                                    <td><code>S</code>, <code>↓</code></td>
	                                    <td>Scroll down</td>
	                                </tr>
	                                <tr>
	                                    <td><code>D</code>, <code>→</code></td>
	                                    <td>Forward one page (Long Strip: scroll to next page)</td>
	                                </tr>
	                                <tr>
	                                    <td><code>F</code></td>
	                                    <td>Change image scaling mode</td>
	                                </tr>
	                                <tr>
	                                    <td><code>Shift</code></td>
	                                    <td>Skip 5 pages faster (Long Strip: jump 5 pages)</td>
	                                </tr>
	                                <tr>
	                                    <td><code>+</code>, <code>-</code></td>
	                                    <td>Zoom (Long Strip: affects all images, responsive)</td>
	                                </tr>
	                            </table>

	                        </p>
	                    </div>
	                </div>
	                <div class="buttons">
	                    <button type="button" class="btn btn-primary" id="save-settings">Save</button>
	                    <button type="button" class="btn btn-secondary" id="cancel-settings">Cancel</button>
	                </div>
	            </div>
	        </div>
	    `;
	    document.body.insertAdjacentHTML('beforeend', modalHTML);
	    const modal = document.getElementById('enhanced-settings-modal');

	    // Set current values
	    Object.keys(settings).forEach(key => {
	        if (key !== 'version') {
	            const control = modal.querySelector(`[data-setting="${key}"]`);
	            if (control) {
	                control.value = settings[key];
	            }
	        }
	    });

	    // Handle save button
	    modal.querySelector('#save-settings').addEventListener('click', function() {
	        // Read values from modal before removing it
	        const longStripModeValue = modal.querySelector('[data-setting="long_strip_mode"]').value;
	        localStorage.setItem('nhentai_long_strip_mode', longStripModeValue);

	        const imageLoadingModeValue = modal.querySelector('[data-setting="image_loading_mode"]').value;
	        localStorage.setItem('nhentai_image_loading_mode', imageLoadingModeValue);

	        const originalSettings = window.reader.get_settings();
	        delete originalSettings.long_strip_mode;
			delete originalSettings.image_loading_mode;

	        modal.querySelectorAll('.control').forEach(control => {
	            const setting = control.dataset.setting;
	            if (setting !== 'long_strip_mode' && setting !== 'image_loading_mode') {
	                 let value = control.value;

	                 if (typeof originalSettings[setting] === 'number') {
	                     value = parseInt(value, 10);
	                 }
	                 originalSettings[setting] = value;
	            }
	        });

	        // Now remove the modal
	        modal.remove();

	        // Then apply settings
	        window.reader.set_settings(originalSettings);
	        window.reader.apply_settings();
	    });

	    // Handle cancel button
	    modal.querySelector('#cancel-settings').addEventListener('click', function() {
	        modal.remove();
	    });

	    // Handle click outside modal
	    modal.addEventListener('click', function(e) {
	        if (e.target === modal) {
	            modal.remove();
	        }
	    });
	}

	// Initialize when page loads
	function initialize() {
	    // Check if we're on a reader page
	    if (window.location.pathname.match(/\/g\/\d+\/\d+\//)) {
	        waitForReader(() => {
	            enhanceReaderSettings();
	            addLongStripToSettings();
	            window.reader.apply_settings();
	        });
	    }
	}

	// Run initialization
	if (document.readyState === 'loading') {
	    document.addEventListener('DOMContentLoaded', initialize);
	} else {
	    initialize();
	}

})();