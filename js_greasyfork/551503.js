// ==UserScript==
// @name         ReCover: Magically Rehost Album Covers to ptpimg
// @namespace    waiter7
// @version      1.10.1
// @description  Magically Rehost album covers and artist images to ptpimg on RED and PTP torrent and artist pages
// @author       waiter7 @ RED
// @license      MIT
// @match        https://redacted.sh/torrents.php?id=*
// @match        https://redacted.sh/artist.php?id=*
// @match        https://passthepopcorn.me/torrents.php?id=*
// @match        https://passthepopcorn.me/artist.php?id=*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/551503/ReCover%3A%20Magically%20Rehost%20Album%20Covers%20to%20ptpimg.user.js
// @updateURL https://update.greasyfork.org/scripts/551503/ReCover%3A%20Magically%20Rehost%20Album%20Covers%20to%20ptpimg.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const DEBUG = false; // Set to true to enable debug logging

    // Site Detection
    const SITE = {
        isRED: () => window.location.hostname === 'redacted.sh',
        isPTP: () => window.location.hostname === 'passthepopcorn.me',
        getCurrentSite: () => {
            if (SITE.isRED()) return 'RED';
            if (SITE.isPTP()) return 'PTP';
            return 'UNKNOWN';
        }
    };

    // Inject CSS styles (minified)
    const style = document.createElement('style');
    style.textContent = `.w7_recover-settings-panel{display:none;margin-top:10px;padding:10px;border:1px solid #444;border-radius:4px;text-align:left;font-size:12px}.w7_recover-settings-label{display:block;margin-bottom:5px;font-weight:bold}.w7_recover-api-input{width:100%;padding:5px;margin-bottom:15px;border:1px solid #ccc;border-radius:3px;box-sizing:border-box}.w7_recover-downloads-label{display:block;margin-bottom:15px;cursor:pointer}.w7_recover-downloads-checkbox{margin-right:5px}.w7_recover-downloads-text{font-weight:bold}.w7_recover-save-container{text-align:center}.w7_recover-close-container{display:inline-block;padding:5px}.w7_recover-close-link{color:#666;text-decoration:none;font-size:12px}.w7_recover-button-container{margin-top:10px;text-align:center}.w7_recover-main-button{display:inline-block;text-decoration:none;font-size:12px;margin-right:5px}.w7_recover-settings-icon{display:inline-block;text-decoration:none;font-size:12px;color:#999;margin-left:5px;cursor:pointer}`;
    document.head.appendChild(style);

    // Utility functions
    function log(message, type = 'info') {
        if (!DEBUG) return; // Only log if DEBUG is enabled
        
        const prefix = '[ReCover]';
        const styles = {
            info: 'color: #4a9eff',
            success: 'color: #4CAF50',
            error: 'color: #f44336',
            warning: 'color: #ff9800'
        };
        console.log(`%c${prefix} ${message}`, styles[type] || styles.info);
    }


    // Unified Settings Manager
    const Settings = {
        _cache: null,
        
        _getData() {
            if (!this._cache) {
                const data = GM_getValue('w7_recover', '{}');
                log(`Retrieved w7_recover data: ${data}`);
                this._cache = JSON.parse(data);
            }
            return this._cache;
        },
        
        _saveData() {
            const jsonData = JSON.stringify(this._cache);
            log(`Saving w7_recover data: ${jsonData}`);
            GM_setValue('w7_recover', jsonData);
        },
        
        get(key, defaultValue) {
            const data = this._getData();
            const value = data[key] !== undefined ? data[key] : defaultValue;
            log(`Getting ${key}: ${value}`);
            return value;
        },
        
        set(key, value) {
            this._getData(); // Ensure cache is loaded
            this._cache[key] = value;
            log(`Setting ${key}: ${value}`);
            this._saveData();
        },
        
        // Convenience getters with defaults
        getApiKey: () => Settings.get('ptp_api_key', null),
        getFallbackSetting: () => Settings.get('enable_fallbacks', true),
        getRecoverCounter: () => Settings.get('w7recover_counter', 0),
        incrementRecoverCounter: () => {
            const current = Settings.get('w7recover_counter', 0);
            const newCount = current + 1;
            Settings.set('w7recover_counter', newCount);
            log(`Recover counter incremented: ${newCount}`, 'success');
            return newCount;
        }
    };

    // Backward compatibility functions
    const getRecoverData = () => Settings._getData();
    const setRecoverData = (data) => { Settings._cache = data; Settings._saveData(); };
    const getApiKey = Settings.getApiKey;
    const setApiKey = (key) => Settings.set('ptp_api_key', key);
    const getFallbackSetting = Settings.getFallbackSetting;
    const setFallbackSetting = (allow) => Settings.set('enable_fallbacks', allow);
    const getRecoverCounter = Settings.getRecoverCounter;
    const incrementRecoverCounter = Settings.incrementRecoverCounter;
    
    // Legacy function names for backward compatibility
    const getDownloadSetting = getFallbackSetting;
    const setDownloadSetting = setFallbackSetting;

    // DOM Helper Functions
    const DOM = {
        create(tag, props = {}, children = []) {
            const el = document.createElement(tag);
            Object.entries(props).forEach(([key, value]) => {
                if (key === 'textContent' || key === 'innerHTML') {
                    el[key] = value;
                } else if (key === 'style' && typeof value === 'object') {
                    Object.assign(el.style, value);
                } else {
                    el[key] = value;
                }
            });
            children.forEach(child => {
                if (typeof child === 'string') {
                    el.appendChild(document.createTextNode(child));
                } else {
                    el.appendChild(child);
                }
            });
            return el;
        },
        
        div: (props, children) => DOM.create('div', props, children),
        span: (props, children) => DOM.create('span', props, children),
        label: (props, children) => DOM.create('label', props, children),
        input: (props) => DOM.create('input', props),
        button: (props, children) => DOM.create('button', props, children),
        a: (props, children) => DOM.create('a', props, children)
    };

    // Constants
    const CONSTANTS = {
        // URLs
        PTPIMG_UPLOAD_URL: 'https://ptpimg.me/upload.php',
        PTPIMG_INDEX_URL: 'https://ptpimg.me/index.php',
        PTPIMG_BASE_URL: 'https://ptpimg.me',
        
        // Referrers
        REFERRERS: {
            DISCOGS: 'https://www.discogs.com/',
            IMGUR: 'https://imgur.com/',
            MUSICBRAINZ: 'https://musicbrainz.org/',
            LASTFM: 'https://www.last.fm/'
        },
        
        // Timeouts and delays
        TIMEOUTS: {
            HTTP_REQUEST: 30000,
            MIME_CHECK: 10000,
            RETRY_DELAY: 1000,
            INIT_DELAY: 500,
            FADE_DELAY: 500,
            ERROR_DISPLAY: 5000,
            SUCCESS_DISPLAY: 3000
        },
        
        // Limits and dimensions
        LIMITS: {
            MAX_RETRY_ATTEMPTS: 5,
            DEFAULT_MAX_DIMENSION: 500,
            VECTOR_THRESHOLD: 2000,
            MIN_DIMENSION: 100,
            MAX_DIMENSION_SETTING: 2000
        },
        
        // Selectors (site-specific)
        SELECTORS: {
            RED: {
                COVERS: '#covers',
                SIDEBAR: '.sidebar',
                IMAGE_BOX: '.box.box_image',
                AUTH_INPUT: 'input[name="auth"]',
                TORRENT_FORM: 'form[name="torrent_group"][action="torrents.php"]',
                ARTIST_FORM: 'form.edit_form[name="artist"][action="artist.php"]',
                COVER_IMAGE: 'img' // Generic, found within #covers
            },
            PTP: {
                COVERS: '.panel__body', // Cover is in a panel body
                SIDEBAR: '.sidebar',
                IMAGE_BOX: '.panel', // PTP uses .panel instead of .box
                CSRF_INPUT: 'input[name="AntiCsrfToken"]',
                TORRENT_FORM: 'form[action*="torrents.php"]',
                ARTIST_FORM: 'form[action*="artist.php"]',
                COVER_IMAGE: '.sidebar-cover-image' // Specific class for cover images
            },
            // Helper to get site-specific selector
            get: (key) => {
                const site = SITE.getCurrentSite();
                return CONSTANTS.SELECTORS[site]?.[key] || null;
            }
        },
        
        // Quality settings - removed, always use full quality
        QUALITY: {
            JPEG_FULL: 1.0
        }
    };

    // HTTP Request Wrapper
    const HTTP = {
        request(options) {
            return new Promise((resolve, reject) => {
                const defaultOptions = {
                    timeout: CONSTANTS.TIMEOUTS.HTTP_REQUEST,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                    }
                };

                GM_xmlhttpRequest({
                    ...defaultOptions,
                    ...options,
                    onload: (response) => {
                        log(`HTTP ${options.method || 'GET'} ${options.url}: ${response.status}`);
                        resolve(response);
                    },
                    onerror: (error) => {
                        log(`HTTP ${options.method || 'GET'} ${options.url} failed: ${error.error || 'Unknown error'}`, 'error');
                        reject(new Error(`Request failed: ${error.error || 'Unknown error'}`));
                    },
                    ontimeout: () => {
                        log(`HTTP ${options.method || 'GET'} ${options.url} timed out`, 'warning');
                        reject(new Error('Request timed out'));
                    }
                });
            });
        },

        get(url, options = {}) {
            return this.request({ method: 'GET', url, ...options });
        },

        post(url, data, options = {}) {
            return this.request({ method: 'POST', url, data, ...options });
        },

        head(url, options = {}) {
            return this.request({ 
                method: 'HEAD', 
                url, 
                timeout: CONSTANTS.TIMEOUTS.MIME_CHECK,
                ...options 
            });
        }
    };

    // Function Modules - Organized by responsibility
    const ImageProcessor = {
        isPtpimgUrl(url) {
            return url && url.includes('ptpimg.me');
        },

        isStaticImage(url) {
            // Check if this is a static placeholder image from RED or PTP
            if (!url) return false;
            
            // Match RED's static images: /static/common/, static/common/, or URLs relative to RED
            if (url.startsWith('static/') || url.startsWith('/static/')) {
                return true;
            }
            
            // For full URLs, check both RED and PTP static paths
            if (url.includes('://')) {
                try {
                    const urlObj = new URL(url);
                    
                    // Check if it's from redacted.sh and has /static/ in the path
                    if (urlObj.hostname.includes('redacted.sh') && urlObj.pathname.includes('/static/')) {
                        return true;
                    }
                    
                    // Check if it's from passthepopcorn.me and has /static/ in the path
                    if (urlObj.hostname.includes('passthepopcorn.me') && urlObj.pathname.includes('/static/')) {
                        return true;
                    }
                } catch (e) {
                    // If URL parsing fails, fall back to original behavior for safety
                    return false;
                }
            }
            
            return false;
        },

        extractOriginalImageUrl(url) {
            if (!url) return url;
            
            // Check if this is a RED cached image URL (image.php?c=1&i=...)
            const cacheMatch = url.match(/\/image\.php\?.*[&?]i=([^&]+)/);
            if (cacheMatch) {
                const encodedUrl = cacheMatch[1];
                const decodedUrl = decodeURIComponent(encodedUrl);
                log(`Extracted original URL from cache: ${decodedUrl}`);
                return decodedUrl;
            }
            
            return url; // Return original URL if not cached
        },

        optimizeAmazonUrl(url) {
            if (!url || !url.includes('amazon.com')) {
                return url;
            }
            
            // Only remove specific low-quality Amazon parameters, preserve legitimate ones
            let optimizedUrl = url;
            
            // Remove specific Amazon image size/quality parameters
            optimizedUrl = optimizedUrl.replace(/_SL\d+_/g, ''); // Size limit parameters
            optimizedUrl = optimizedUrl.replace(/_AC_UL\d+_/g, ''); // Auto crop/upload limit
            optimizedUrl = optimizedUrl.replace(/_AC_SL\d+_/g, ''); // Auto crop/size limit
            optimizedUrl = optimizedUrl.replace(/_SR\d+,\d+_/g, ''); // Size restriction
            optimizedUrl = optimizedUrl.replace(/_QL\d+_/g, ''); // Quality limit
            
            // Clean up any double dots that might result from parameter removal
            optimizedUrl = optimizedUrl.replace(/\.+/g, '.');
            
            if (optimizedUrl !== url) {
                log(`Optimized Amazon URL: ${url} -> ${optimizedUrl}`);
            }
            
            return optimizedUrl;
        },

        extractLightboxUrl(imgElement) {
            if (!imgElement) {
                return null;
            }
            
            const onclickAttr = imgElement.getAttribute('onclick');
            if (!onclickAttr || !onclickAttr.includes('lightbox.init')) {
                return null;
            }
            
            // Extract URL from lightbox.init('URL', width)
            const urlMatch = onclickAttr.match(/lightbox\.init\(['"]([^'"]+)['"](?:,\s*\d+)?\)/);
            if (urlMatch && urlMatch[1]) {
                const lightboxUrl = urlMatch[1];
                log(`Extracted lightbox URL: ${lightboxUrl}`);
                return lightboxUrl;
            }
            
            return null;
        },

        getFileExtension(url, data) {
            // Try URL first
            const urlMatch = url.match(/\.(jpg|jpeg|png|gif|webp)(\?|$)/i);
            if (urlMatch) {
                return urlMatch[1].toLowerCase() === 'jpeg' ? 'jpg' : urlMatch[1].toLowerCase();
            }

            // Check magic bytes
            if (data) {
                const bytes = new Uint8Array(data.slice(0, 12));
                if (bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF) return 'jpg';
                if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47) return 'png';
                if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) return 'gif';
                if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46) return 'webp';
            }

            return 'jpg'; // default
        }
    };

    const PageUtils = {
        getPageData() {
            const groupIdMatch = window.location.href.match(/[?&]id=(\d+)/);
            const groupId = groupIdMatch ? groupIdMatch[1] : null;

            let authKey = null;
            
            if (SITE.isRED()) {
                // RED uses authkey
                if (typeof authkey !== 'undefined') {
                    authKey = authkey;
                }
                
                if (!authKey) {
                    const authInput = document.querySelector(CONSTANTS.SELECTORS.RED.AUTH_INPUT);
                    if (authInput) {
                        authKey = authInput.value;
                    }
                }
            } else if (SITE.isPTP()) {
                // PTP uses AntiCsrfToken
                const csrfInput = document.querySelector(CONSTANTS.SELECTORS.PTP.CSRF_INPUT);
                if (csrfInput) {
                    authKey = csrfInput.value;
                }
            }

            return { groupId, authKey };
        },

        isArtistPage() {
            return window.location.href.includes('/artist.php?id=');
        },

        getArtistPageData() {
            const artistIdMatch = window.location.href.match(/[?&]id=(\d+)/);
            const artistId = artistIdMatch ? artistIdMatch[1] : null;

            let authKey = null;
            
            if (SITE.isRED()) {
                // RED uses authkey
                if (typeof authkey !== 'undefined') {
                    authKey = authkey;
                }
                
                if (!authKey) {
                    const authInput = document.querySelector(CONSTANTS.SELECTORS.RED.AUTH_INPUT);
                    if (authInput) {
                        authKey = authInput.value;
                    }
                }
            } else if (SITE.isPTP()) {
                // PTP uses AntiCsrfToken
                const csrfInput = document.querySelector(CONSTANTS.SELECTORS.PTP.CSRF_INPUT);
                if (csrfInput) {
                    authKey = csrfInput.value;
                }
            }

            return { artistId, authKey };
        }
    };

    // Migration function for backward compatibility
    function migrateOldStorage() {
        log('Checking for old storage keys to migrate...');
        
        // Check for old API key
        const oldApiKey = GM_getValue('w7_ptpimg_api_key', null);
        const oldDownloadSetting = GM_getValue('w7_allow_downloads', null);
        
        log(`Found old API key: ${oldApiKey !== null ? 'YES' : 'NO'}`);
        log(`Found old download setting: ${oldDownloadSetting !== null ? 'YES (' + oldDownloadSetting + ')' : 'NO'}`);
        
        if (oldApiKey !== null || oldDownloadSetting !== null) {
            log('Found old storage keys, migrating to new structure...');
            
            const data = getRecoverData();
            log(`Current w7_recover data before migration: ${JSON.stringify(data)}`);
            
            // Migrate API key
            if (oldApiKey !== null && !data.ptp_api_key) {
                data.ptp_api_key = oldApiKey;
                log(`Migrated API key: ${oldApiKey}`);
            }
            
            // Migrate download setting to fallback setting
            if (oldDownloadSetting !== null && data.enable_fallbacks === undefined) {
                data.enable_fallbacks = oldDownloadSetting;
                log(`Migrated download setting to fallback setting: ${oldDownloadSetting}`);
            }
            
            // Also migrate existing enable_downloads to enable_fallbacks
            if (data.enable_downloads !== undefined && data.enable_fallbacks === undefined) {
                data.enable_fallbacks = data.enable_downloads;
                delete data.enable_downloads;
                log(`Migrated enable_downloads to enable_fallbacks: ${data.enable_fallbacks}`);
            }
            
            // Save migrated data
            setRecoverData(data);
            log(`Saved migrated data: ${JSON.stringify(data)}`);
            
            // Remove old keys by deleting them (not setting to undefined)
            if (oldApiKey !== null) {
                GM_setValue('w7_ptpimg_api_key', null);
                log('Removed old API key storage');
            }
            
            if (oldDownloadSetting !== null) {
                GM_setValue('w7_allow_downloads', null);
                log('Removed old download setting storage');
            }
            
            log('Migration completed successfully');
        } else {
            log('No old storage keys found, no migration needed');
            // Even if no migration needed, ensure we have a basic structure
            const data = getRecoverData();
            if (Object.keys(data).length === 0) {
                log('Creating initial empty w7_recover structure');
                setRecoverData({});
            }
        }
    }

    // Debug function to show current storage state
    function debugStorageState() {
        log('=== STORAGE DEBUG ===');
        log(`w7_recover: ${GM_getValue('w7_recover', 'NOT SET')}`);
        log(`w7_ptpimg_api_key (old): ${GM_getValue('w7_ptpimg_api_key', 'NOT SET')}`);
        log(`w7_allow_downloads (old): ${GM_getValue('w7_allow_downloads', 'NOT SET')}`);
        
        const data = getRecoverData();
        log(`Parsed w7_recover data: ${JSON.stringify(data)}`);
        log(`API Key from new system: ${getApiKey()}`);
        log(`Fallback setting from new system: ${getFallbackSetting()}`);
        log(`Recover counter: ${getRecoverCounter()}`);
        log('=== END STORAGE DEBUG ===');
    }


    // Backward compatibility functions - delegate to modules
    const isPtpimgUrl = ImageProcessor.isPtpimgUrl;
    const isStaticImage = ImageProcessor.isStaticImage;
    const extractOriginalImageUrl = ImageProcessor.extractOriginalImageUrl;
    const optimizeAmazonUrl = ImageProcessor.optimizeAmazonUrl;
    const extractLightboxUrl = ImageProcessor.extractLightboxUrl;
    const getFileExtension = ImageProcessor.getFileExtension;

    // Check MIME type of image URL
    function checkImageMimeType(imageUrl) {
        return HTTP.head(imageUrl)
            .then(response => {
                const contentType = response.responseHeaders.match(/content-type:\s*([^\r\n]+)/i);
                const mimeType = contentType ? contentType[1].toLowerCase().trim() : '';
                log(`MIME type check for ${imageUrl}: ${mimeType}`);
                return mimeType;
            })
            .catch(() => {
                // If HEAD request fails, assume it's compatible
                log(`MIME type check failed for ${imageUrl}, assuming compatible`);
                return 'image/jpeg';
            });
    }

    // Convert WebP to JPEG
    function convertWebpToJpeg(webpData) {
        return new Promise((resolve, reject) => {
            try {
                // Create a canvas to convert the WebP to JPEG
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const img = new Image();
                
                img.onload = function() {
                    // Always preserve original dimensions for regular images
                    // Only apply max dimension constraint for vector/unlimited size sources
                    let targetWidth = img.width;
                    let targetHeight = img.height;
                    
                    // Check if this might be a vector or unlimited size source
                    // Vectors often render at very large sizes or unusual dimensions
                    const maxDimension = 500; // Hardcoded max dimension for vectors
                    const isLikelyVector = (targetWidth > CONSTANTS.LIMITS.VECTOR_THRESHOLD || targetHeight > CONSTANTS.LIMITS.VECTOR_THRESHOLD) && 
                                          (targetWidth % 100 === 0 || targetHeight % 100 === 0);
                    
                    if (isLikelyVector && (targetWidth > maxDimension || targetHeight > maxDimension)) {
                        const aspectRatio = targetWidth / targetHeight;
                        
                        if (targetWidth > targetHeight) {
                            // Landscape: limit width to maxDimension
                            targetWidth = maxDimension;
                            targetHeight = Math.round(maxDimension / aspectRatio);
                        } else {
                            // Portrait or square: limit height to maxDimension
                            targetHeight = maxDimension;
                            targetWidth = Math.round(maxDimension * aspectRatio);
                        }
                        
                        log(`Detected likely vector image, resizing from ${img.width}x${img.height} to ${targetWidth}x${targetHeight} (max: ${maxDimension}px)`);
                    } else {
                        log(`Preserving original image dimensions: ${img.width}x${img.height}`);
                    }
                    
                    canvas.width = targetWidth;
                    canvas.height = targetHeight;
                    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
                    
                    // Convert to JPEG blob with full quality
                    canvas.toBlob(function(blob) {
                        if (blob) {
                            log(`Successfully converted WebP to JPEG at full quality`);
                            resolve(blob);
                        } else {
                            reject(new Error('Failed to convert WebP to JPEG'));
                        }
                    }, 'image/jpeg', CONSTANTS.QUALITY.JPEG_FULL);
                };
                
                img.onerror = function() {
                    reject(new Error('Failed to load WebP image for conversion'));
                };
                
                // Create blob URL from WebP data
                const webpBlob = new Blob([webpData], { type: 'image/webp' });
                img.src = URL.createObjectURL(webpBlob);
                
            } catch (error) {
                reject(new Error(`WebP conversion error: ${error.message}`));
            }
        });
    }

    // Find the target image that will be rehosted
    function findTargetImage(processedUrl) {
        const images = document.querySelectorAll('img');
        
        for (const img of images) {
            // Check if this image's src or data-gazelle-temp-src matches the processed URL
            if (img.src === processedUrl || img.getAttribute('data-gazelle-temp-src') === processedUrl) {
                return img;
            }
            
            // Also check if this image's lightbox URL matches the processed URL
            // This handles the case where we processed a lightbox URL but the img src is still the thumbnail
            const lightboxUrl = extractLightboxUrl(img);
            if (lightboxUrl === processedUrl) {
                return img;
            }
            
            // Additional check: if the processed URL is a lightbox URL, also check if the img src 
            // contains the same base image (handles RED's cached image URLs)
            if (processedUrl.includes('image.php?c=1&i=')) {
                const processedOriginal = extractOriginalImageUrl(processedUrl);
                const imgOriginal = extractOriginalImageUrl(img.src);
                if (processedOriginal && imgOriginal && processedOriginal === imgOriginal) {
                    return img;
                }
            }
        }
        
        return null;
    }

    // Darken the target image when rehosting starts
    function darkenTargetImage(processedUrl) {
        const targetImage = findTargetImage(processedUrl);
        if (targetImage) {
            log(`Darkening target image for rehosting: ${targetImage.src}`);
            // Store original filter to restore later if needed
            targetImage.setAttribute('data-original-filter', targetImage.style.filter || '');
            targetImage.style.transition = 'filter 0.3s ease-in-out';
            targetImage.style.filter = 'brightness(0.7) contrast(0.9)';
        } else {
            log(`Could not find target image to darken: ${processedUrl}`, 'warning');
        }
    }

    // Update image with magical transition effect
    function updateImageWithTransition(processedUrl, newUrl, button, shouldFadeButton = true) {
        const targetImage = findTargetImage(processedUrl);
        
        if (!targetImage) {
            log(`Could not find target image for transition. Processed URL: ${processedUrl}`, 'warning');
            log('Available images:', document.querySelectorAll('img').length > 0 ? 
                Array.from(document.querySelectorAll('img')).map(img => ({ src: img.src, lightbox: extractLightboxUrl(img) })) : 'none');
            if (shouldFadeButton) {
                fadeOutButton(button);
            }
            return;
        }

        log(`Found target image for magical transition: ${targetImage.src}`);

        // Step 1: Preload the new image in background
        const preloadImage = new Image();
        preloadImage.onload = function() {
            log('New image preloaded successfully, starting magical transition');
            
            // Step 2: Create white flash overlay
            const imageContainer = targetImage.parentElement;
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: white;
                opacity: 0;
                pointer-events: none;
                z-index: 1000;
                transition: opacity 0.15s ease-in-out;
            `;
            
            // Ensure container has relative positioning
            const originalPosition = imageContainer.style.position;
            if (!originalPosition || originalPosition === 'static') {
                imageContainer.style.position = 'relative';
            }
            
            imageContainer.appendChild(overlay);
            
            // Step 3: Flash to white
            setTimeout(() => {
                overlay.style.opacity = '0.95';
            }, 10);
            
            // Step 4: Swap the image source during the white flash
            setTimeout(() => {
                // Update the URL
                targetImage.src = newUrl;
                if (targetImage.hasAttribute('data-gazelle-temp-src')) {
                    targetImage.setAttribute('data-gazelle-temp-src', newUrl);
                }
                
                // Update onclick lightbox URL if it exists
                const onclickAttr = targetImage.getAttribute('onclick');
                if (onclickAttr && onclickAttr.includes('lightbox.init')) {
                    const updatedOnclick = onclickAttr.replace(/lightbox\.init\('([^']+)'/, `lightbox.init('${newUrl}'`);
                    targetImage.setAttribute('onclick', updatedOnclick);
                    log(`Updated lightbox onclick from: ${onclickAttr} to: ${updatedOnclick}`);
                }
                
                // Remove darkening effect and restore original filter
                const originalFilter = targetImage.getAttribute('data-original-filter') || '';
                targetImage.style.filter = originalFilter;
                targetImage.removeAttribute('data-original-filter');
                
                // Track this rehosted image for future consistency
                rehostedImages.set(processedUrl, newUrl);
                log(`Tracked rehosted image: ${processedUrl} -> ${newUrl}`);
                
                // Also update any other images with the same original URL to ensure consistency
                updateAllImageReferences(processedUrl, newUrl, targetImage);
                
            }, 80);
            
            // Step 5: Fade away the white to reveal the new image
            setTimeout(() => {
                overlay.style.opacity = '0';
                
                // Remove overlay after transition completes
                setTimeout(() => {
                    if (overlay.parentNode) {
                        overlay.parentNode.removeChild(overlay);
                    }
                    // Restore original positioning if we changed it
                    if (!originalPosition || originalPosition === 'static') {
                        imageContainer.style.position = originalPosition;
                    }
                }, 150);
                
                // Fade out the button after magic is complete (if requested)
                if (shouldFadeButton) {
                    setTimeout(() => {
                        fadeOutButton(button);
                    }, CONSTANTS.TIMEOUTS.FADE_DELAY);
                }
                
            }, 120);
        };
        
        preloadImage.onerror = function() {
            log('Failed to preload new image, falling back to simple update', 'warning');
            // Fallback to simple update
            targetImage.src = newUrl;
            if (targetImage.hasAttribute('data-gazelle-temp-src')) {
                targetImage.setAttribute('data-gazelle-temp-src', newUrl);
            }
            
            // Remove darkening effect
            const originalFilter = targetImage.getAttribute('data-original-filter') || '';
            targetImage.style.filter = originalFilter;
            targetImage.removeAttribute('data-original-filter');
            
            if (shouldFadeButton) {
                fadeOutButton(button);
            }
        };
        
        // Start preloading
        preloadImage.src = newUrl;
    }

    // Update all references to an image URL throughout the page
    function updateAllImageReferences(processedUrl, newUrl, targetImage = null) {
        // Extract the original URL from cached format if needed
        const originalProcessedUrl = extractOriginalImageUrl(processedUrl);
        
        // Update all img elements that might reference this URL
        const allImages = document.querySelectorAll('img');
        allImages.forEach(img => {
            // Skip the target image since we already updated it
            if (targetImage && img === targetImage) {
                return;
            }
            
            // Check src attribute
            if (img.src === processedUrl || img.src === originalProcessedUrl) {
                img.src = newUrl;
                log(`Updated img src: ${processedUrl} -> ${newUrl}`);
            }
            
            // Check data-gazelle-temp-src attribute
            const tempSrc = img.getAttribute('data-gazelle-temp-src');
            if (tempSrc === processedUrl || tempSrc === originalProcessedUrl) {
                img.setAttribute('data-gazelle-temp-src', newUrl);
                log(`Updated img data-gazelle-temp-src: ${processedUrl} -> ${newUrl}`);
            }
            
            // Check if this image's lightbox URL matches the processed URL
            const lightboxUrl = extractLightboxUrl(img);
            if (lightboxUrl === processedUrl) {
                // Update the image src to the new URL
                img.src = newUrl;
                // Update data-gazelle-temp-src if it exists
                if (img.hasAttribute('data-gazelle-temp-src')) {
                    img.setAttribute('data-gazelle-temp-src', newUrl);
                }
                log(`Updated img via lightbox match: ${processedUrl} -> ${newUrl}`);
            }
            
            // Update onclick lightbox URLs
            const onclick = img.getAttribute('onclick');
            if (onclick && onclick.includes('lightbox.init')) {
                let updatedOnclick = onclick;
                if (onclick.includes(processedUrl)) {
                    updatedOnclick = onclick.replace(processedUrl, newUrl);
                } else if (onclick.includes(originalProcessedUrl)) {
                    updatedOnclick = onclick.replace(originalProcessedUrl, newUrl);
                }
                if (updatedOnclick !== onclick) {
                    img.setAttribute('onclick', updatedOnclick);
                    log(`Updated img onclick lightbox: ${onclick} -> ${updatedOnclick}`);
                }
            }
        });
        
        // Update any cached image URLs in RED's image.php format
        const cachedImagePattern = /\/image\.php\?.*[&?]i=([^&]+)/g;
        document.querySelectorAll('*').forEach(element => {
            // Check all attributes that might contain image URLs
            ['src', 'data-src', 'data-original', 'data-gazelle-temp-src', 'onclick'].forEach(attr => {
                const value = element.getAttribute(attr);
                if (value && value.includes('image.php')) {
                    let updated = false;
                    const newValue = value.replace(cachedImagePattern, (match, encodedUrl) => {
                        const decodedUrl = decodeURIComponent(encodedUrl);
                        if (decodedUrl === originalProcessedUrl) {
                            updated = true;
                            return match.replace(encodedUrl, encodeURIComponent(newUrl));
                        }
                        return match;
                    });
                    
                    if (updated) {
                        element.setAttribute(attr, newValue);
                        log(`Updated cached image reference in ${attr}: ${value} -> ${newValue}`);
                    }
                }
            });
        });
    }

    // Fade out the success button/text
    function fadeOutButton(button) {
        // Find the container that holds both the button and settings icon
        const container = button.closest('.w7_recover-button-container');
        const elementToFade = container || button;
        
        elementToFade.style.transition = 'opacity 0.5s ease-out';
        elementToFade.style.opacity = '0';
        
        setTimeout(() => {
            // Remove the entire container or just the button if no container found
            if (elementToFade.parentNode) {
                elementToFade.parentNode.removeChild(elementToFade);
            }
        }, 500);
    }

    // Resolve redirects to get the final URL
    // This helps with URLs that have 301/302 redirects without CORS headers
    // Note: This may not work with Cloudflare-protected sites that challenge HEAD requests
    function resolveRedirects(url) {
        return new Promise((resolve, reject) => {
            log(`Checking for redirects: ${url}`);
            
            HTTP.head(url)
                .then(response => {
                    // Check if this is a redirect (3xx status)
                    if (response.status >= 300 && response.status < 400) {
                        // Extract Location header
                        const locationMatch = response.responseHeaders.match(/location:\s*([^\r\n]+)/i);
                        if (locationMatch && locationMatch[1]) {
                            const redirectUrl = locationMatch[1].trim();
                            
                            // Resolve relative URLs
                            try {
                                const finalUrl = new URL(redirectUrl, url).href;
                                log(`Found redirect: ${finalUrl}`, 'success');
                                resolve(finalUrl);
                            } catch (e) {
                                log(`Failed to parse redirect URL: ${e.message}`, 'error');
                                resolve(url);
                            }
                        } else {
                            resolve(url);
                        }
                    } else {
                        log(`No redirect detected (status ${response.status})`);
                        resolve(url);
                    }
                })
                .catch(error => {
                    log(`HEAD request failed: ${error.message}`, 'warning');
                    // If HEAD fails (e.g., Cloudflare challenge), just use the original URL
                    resolve(url);
                });
        });
    }

    // Download image and upload binary data to PTpimg
    function uploadBinaryToPtpimg(imageUrl, apiKey) {
        return new Promise((resolve, reject) => {
            // Check fallback permission
            const fallbackSetting = getFallbackSetting();
            if (fallbackSetting === false) {
                reject(new Error('Fallbacks are disabled by user preference'));
                return;
            }
            
            log(`Downloading image for binary upload: ${imageUrl}`);
            
            // Determine appropriate referrer based on image host
            let referrer = '';
            if (imageUrl.includes('discogs.com')) {
                referrer = CONSTANTS.REFERRERS.DISCOGS;
            } else if (imageUrl.includes('imgur.com')) {
                referrer = CONSTANTS.REFERRERS.IMGUR;
            } else if (imageUrl.includes('musicbrainz.org')) {
                referrer = CONSTANTS.REFERRERS.MUSICBRAINZ;
            } else if (imageUrl.includes('last.fm')) {
                referrer = CONSTANTS.REFERRERS.LASTFM;
            } else {
                // For unknown domains, use the origin of the image URL as referrer
                // This helps bypass anti-hotlinking protection
                try {
                    const url = new URL(imageUrl);
                    referrer = `${url.protocol}//${url.hostname}/`;
                    log(`Using image origin as referrer: ${referrer}`);
                } catch (e) {
                    log(`Failed to parse URL for referrer: ${e.message}`, 'warning');
                    referrer = '';
                }
            }
            
            // First, download the image
            GM_xmlhttpRequest({
                method: 'GET',
                url: imageUrl,
                responseType: 'arraybuffer',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Referer': referrer,
                    'Accept': 'image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
                },
                onload: function(response) {
                    if (response.status !== 200) {
                        reject(new Error(`Failed to download image: HTTP ${response.status}`));
                        return;
                    }
                    
                    if (!response.response || response.response.byteLength === 0) {
                        reject(new Error('Downloaded image is empty'));
                        return;
                    }
                    
                    log(`Downloaded image: ${response.response.byteLength} bytes`);
                    
                    // Determine file extension and check if it's WebP
                    const extension = getFileExtension(imageUrl, response.response);
                    let processedData = response.response;
                    let finalExtension = extension;
                    
                    // If it's WebP, convert to JPEG
                    if (extension === 'webp') {
                        log('Converting WebP to JPEG...');
                        convertWebpToJpeg(response.response)
                            .then(jpegBlob => {
                                log(`WebP converted to JPEG blob: ${jpegBlob.size} bytes`);
                                return jpegBlob.arrayBuffer();
                            })
                            .then(jpegData => {
                                processedData = jpegData;
                                finalExtension = 'jpg';
                                log(`Final extension set to: ${finalExtension}`);
                                uploadProcessedImage();
                            })
                            .catch(conversionError => {
                                log(`WebP conversion failed: ${conversionError.message}`, 'warning');
                                // Fallback to original data
                                uploadProcessedImage();
                            });
                    } else {
                        uploadProcessedImage();
                    }
                    
                    function uploadProcessedImage() {
                        const filename = `image.${finalExtension}`;
                        
                        // Create blob and form data
                        const blob = new Blob([processedData]);
                        const formData = new FormData();
                        formData.append('api_key', apiKey);
                        formData.append('file-upload[]', blob, filename);
                        
                        log(`Uploading binary data to PTPimg (${filename})`);
                        
                        // Upload to PTPimg
                        GM_xmlhttpRequest({
                            method: 'POST',
                            url: CONSTANTS.PTPIMG_UPLOAD_URL,
                            headers: {
                                'Referer': CONSTANTS.PTPIMG_INDEX_URL,
                                'User-Agent': 'RED-Cover-Rehost/1.0'
                            },
                            data: formData,
                            onload: function(uploadResponse) {
                                log(`PTpimg binary upload response status: ${uploadResponse.status}`);
                                log(`PTpimg binary upload response text: ${uploadResponse.responseText}`);
                                
                                if (uploadResponse.status !== 200) {
                                    reject(new Error(`PTpimg binary upload failed: HTTP ${uploadResponse.status} - ${uploadResponse.responseText}`));
                                    return;
                                }
                                
                                if (!uploadResponse.responseText || !uploadResponse.responseText.trim()) {
                                    reject(new Error('PTpimg returned empty response for binary upload'));
                                    return;
                                }
                                
                                try {
                                    const result = JSON.parse(uploadResponse.responseText);
                                    log(`PTpimg binary upload parsed response:`, result);
                                    
                                    if (Array.isArray(result) && result.length > 0) {
                                        const upload = result[0];
                                        if (upload.code) {
                                            // Handle case where ext might be empty - use our known extension
                                            const ext = upload.ext || finalExtension;
                                            const ptpimgUrl = `${CONSTANTS.PTPIMG_BASE_URL}/${upload.code}.${ext}`;
                                            log(`Binary upload successful: ${ptpimgUrl}`, 'success');
                                            resolve(ptpimgUrl);
                                            return;
                                        }
                                    }
                                    
                                    if (result.error) {
                                        reject(new Error(`PTpimg binary upload error: ${result.error}`));
                                        return;
                                    }
                                    
                                    reject(new Error(`Unexpected PTpimg binary upload response format: ${JSON.stringify(result)}`));
                                    
                                } catch (parseError) {
                                    log(`Failed to parse binary upload response: "${uploadResponse.responseText}"`, 'error');
                                    reject(new Error(`Failed to parse PTpimg binary upload response: ${parseError.message}. Response was: ${uploadResponse.responseText}`));
                                }
                            },
                            onerror: function(error) {
                                reject(new Error(`PTpimg binary upload request failed: ${error.error || 'Unknown error'}`));
                            },
                            ontimeout: function() {
                                reject(new Error('PTpimg binary upload timed out'));
                            },
                            timeout: CONSTANTS.TIMEOUTS.HTTP_REQUEST
                        });
                    }
                },
                onerror: function(error) {
                    reject(new Error(`Failed to download image: ${error.error || 'Unknown error'}`));
                },
                ontimeout: function() {
                    reject(new Error('Image download timed out'));
                },
                timeout: CONSTANTS.TIMEOUTS.HTTP_REQUEST
            });
        });
    }

    // Upload image URL to PTpimg (let PTpimg download it)
    function uploadUrlToPtpimg(imageUrl, apiKey) {
        return new Promise((resolve, reject) => {
            log(`Uploading URL to PTPimg: ${imageUrl}`);
            
            // Create form data for URL upload
            const formData = new FormData();
            formData.append('api_key', apiKey);
            formData.append('link-upload', imageUrl);
            formData.append('upload-links', ''); // This triggers the URL upload
            
        GM_xmlhttpRequest({
            method: 'POST',
            url: CONSTANTS.PTPIMG_UPLOAD_URL,
            headers: {
                'Referer': CONSTANTS.PTPIMG_INDEX_URL,
                'User-Agent': 'RED-Cover-Rehost/1.0'
            },
                data: formData,
                onload: function(response) {
                    log(`PTpimg response status: ${response.status}`);
                    log(`PTpimg response text: ${response.responseText}`);
                    
                    if (response.status !== 200) {
                        reject(new Error(`PTpimg upload failed: HTTP ${response.status} - ${response.responseText}`));
                        return;
                    }
                    
                    // Check if response is empty or not JSON
                    if (!response.responseText || !response.responseText.trim()) {
                        reject(new Error('PTpimg returned empty response'));
                        return;
                    }
                    
                    try {
                        // PTpimg returns JSON array for URL uploads too
                        const result = JSON.parse(response.responseText);
                        log(`PTpimg parsed response:`, result);
                        
                        if (Array.isArray(result) && result.length > 0) {
                            const upload = result[0];
                            if (upload.code && upload.ext) {
                                const ptpimgUrl = `${CONSTANTS.PTPIMG_BASE_URL}/${upload.code}.${upload.ext}`;
                                log(`URL upload successful: ${ptpimgUrl}`, 'success');
                                resolve(ptpimgUrl);
                                return;
                            }
                            
                            // Empty ext means ptpimg couldn't download the image
                            if (upload.code && !upload.ext) {
                                reject(new Error('PTpimg could not download the image (received empty extension)'));
                                return;
                            }
                        }
                        
                        // Check if it's an error response
                        if (result.error) {
                            reject(new Error(`PTpimg error: ${result.error}`));
                            return;
                        }
                        
                        // If we get here, the response format was unexpected
                        reject(new Error(`Unexpected PTpimg response format: ${JSON.stringify(result)}`));
                        
                    } catch (parseError) {
                        // Check if this is a known error that should trigger binary upload fallback
                        const responseText = response.responseText;
                        if (responseText.includes('No contents returned from image url') || 
                            responseText.includes('Fatal error') ||
                            responseText.includes('Exception')) {
                            log(`PTpimg URL upload failed with server error, will try binary upload`, 'warning');
                            reject(new Error('PTpimg_SERVER_ERROR'));
                        } else {
                            // Log the actual response text to help debug
                            log(`Failed to parse response: "${responseText}"`, 'error');
                            reject(new Error(`Failed to parse PTpimg response: ${parseError.message}. Response was: ${responseText}`));
                        }
                    }
                },
                onerror: function(error) {
                    reject(new Error(`PTpimg upload request failed: ${error.error || 'Unknown error'}`));
                },
                ontimeout: function() {
                    reject(new Error('PTpimg upload timed out'));
                },
                timeout: CONSTANTS.TIMEOUTS.HTTP_REQUEST
            });
        });
    }

    // Backward compatibility functions - delegate to modules
    const getPageData = PageUtils.getPageData;
    const isArtistPage = PageUtils.isArtistPage;
    const getArtistPageData = PageUtils.getArtistPageData;

    // Update cover image via edit group page
    function updateCoverImage(newImageUrl) {
        return new Promise((resolve, reject) => {
            const { groupId, authKey } = getPageData();
            
            if (!groupId || !authKey) {
                reject(new Error('Could not find group ID or auth key'));
                return;
            }

            log(`Fetching edit group page for group ${groupId} on ${SITE.getCurrentSite()}`);

            // First, fetch the edit group page to get existing form data
            GM_xmlhttpRequest({
                method: 'GET',
                url: `${window.location.origin}/torrents.php?action=editgroup&groupid=${groupId}`,
                onload: function(response) {
                    if (response.status !== 200) {
                        reject(new Error(`Failed to fetch edit page: HTTP ${response.status}`));
                        return;
                    }

                    try {
                        // Parse the HTML response to extract form data
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, 'text/html');
                        
                        // Find the edit form (use site-specific selector)
                        let form;
                        if (SITE.isRED()) {
                            form = doc.querySelector('form[name="torrent_group"][action="torrents.php"]');
                        } else if (SITE.isPTP()) {
                            form = doc.querySelector('form[action*="torrents.php"]');
                        }
                        
                        if (!form) {
                            reject(new Error('Could not find edit form on page'));
                            return;
                        }

                        // Extract all form data
                        const formData = new FormData();
                        
                        // Add hidden fields
                        const hiddenInputs = form.querySelectorAll('input[type="hidden"]');
                        hiddenInputs.forEach(input => {
                            formData.append(input.name, input.value);
                        });

                        // Add text inputs (preserve existing values except image)
                        const textInputs = form.querySelectorAll('input[type="text"]');
                        textInputs.forEach(input => {
                            if (input.name === 'image') {
                                formData.append('image', newImageUrl);
                                log(`Updated image field: ${newImageUrl}`);
                            } else {
                                formData.append(input.name, input.value);
                            }
                        });

                        // Add textareas (preserve existing content)
                        const textareas = form.querySelectorAll('textarea');
                        textareas.forEach(textarea => {
                            formData.append(textarea.name, textarea.value);
                        });

                        // Add select fields (preserve existing selections)
                        const selects = form.querySelectorAll('select');
                        selects.forEach(select => {
                            const selectedOption = select.querySelector('option[selected]');
                            if (selectedOption) {
                                formData.append(select.name, selectedOption.value);
                            } else if (select.options.length > 0) {
                                formData.append(select.name, select.options[0].value);
                            }
                        });

                        // Add summary for edit log
                        if (SITE.isRED()) {
                            formData.append('summary', 'Rehosted cover image via ReCover');
                        } else if (SITE.isPTP()) {
                            formData.append('summary', 'Rehosted cover image via ReCover');
                        }

                        log(`Submitting updated form data for group ${groupId}`);

                        // Submit the updated form
                        GM_xmlhttpRequest({
                            method: 'POST',
                            url: `${window.location.origin}/torrents.php`,
                            data: formData,
                            onload: function(submitResponse) {
                                if (submitResponse.status === 200) {
                                    log('Cover image updated successfully', 'success');
                                    resolve(newImageUrl);
                                } else {
                                    reject(new Error(`Form submission failed: HTTP ${submitResponse.status}`));
                                }
                            },
                            onerror: function(error) {
                                reject(new Error(`Form submission failed: ${error.error || 'Unknown error'}`));
                            },
                            ontimeout: function() {
                                reject(new Error('Form submission timed out'));
                            },
                            timeout: CONSTANTS.TIMEOUTS.HTTP_REQUEST
                        });

                    } catch (parseError) {
                        reject(new Error(`Failed to parse edit page: ${parseError.message}`));
                    }
                },
                onerror: function(error) {
                    reject(new Error(`Failed to fetch edit page: ${error.error || 'Unknown error'}`));
                },
                ontimeout: function() {
                    reject(new Error('Edit page fetch timed out'));
                },
                timeout: CONSTANTS.TIMEOUTS.HTTP_REQUEST
            });
        });
    }

    // Update artist image via edit artist page
    function updateArtistImage(newImageUrl) {
        return new Promise((resolve, reject) => {
            const { artistId, authKey } = getArtistPageData();
            
            if (!artistId || !authKey) {
                reject(new Error('Could not find artist ID or auth key'));
                return;
            }

            log(`Fetching edit artist page for artist ${artistId}`);

            // First, fetch the edit artist page to get existing form data
            GM_xmlhttpRequest({
                method: 'GET',
                url: `${window.location.origin}/artist.php?action=edit&artistid=${artistId}`,
                onload: function(response) {
                    if (response.status !== 200) {
                        reject(new Error(`Failed to fetch edit page: HTTP ${response.status}`));
                        return;
                    }

                    try {
                        // Parse the HTML response to extract form data
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, 'text/html');
                        
                        // Find the edit form
                        const form = doc.querySelector('form.edit_form[name="artist"][action="artist.php"]');
                        if (!form) {
                            reject(new Error('Could not find edit form on page'));
                            return;
                        }

                        // Extract all form data
                        const formData = new FormData();
                        
                        // Add hidden fields
                        const hiddenInputs = form.querySelectorAll('input[type="hidden"]');
                        hiddenInputs.forEach(input => {
                            formData.append(input.name, input.value);
                        });

                        // Add text inputs (preserve existing values except image)
                        const textInputs = form.querySelectorAll('input[type="text"]');
                        textInputs.forEach(input => {
                            if (input.name === 'image') {
                                formData.append('image', newImageUrl);
                                log(`Updated image field: ${newImageUrl}`);
                            } else {
                                formData.append(input.name, input.value);
                            }
                        });

                        // Add textareas (preserve existing content)
                        const textareas = form.querySelectorAll('textarea');
                        textareas.forEach(textarea => {
                            formData.append(textarea.name, textarea.value);
                        });

                        // Add checkboxes (preserve existing state)
                        const checkboxes = form.querySelectorAll('input[type="checkbox"]');
                        checkboxes.forEach(checkbox => {
                            if (checkbox.checked) {
                                formData.append(checkbox.name, checkbox.value);
                            }
                        });

                        // Add summary for edit log
                        formData.append('summary', 'Rehosted cover image via ReCover');

                        log(`Submitting updated form data for artist ${artistId}`);

                        // Submit the updated form
                        GM_xmlhttpRequest({
                            method: 'POST',
                            url: `${window.location.origin}/artist.php`,
                            data: formData,
                            onload: function(submitResponse) {
                                if (submitResponse.status === 200) {
                                    log('Artist image updated successfully', 'success');
                                    resolve(newImageUrl);
                                } else {
                                    reject(new Error(`Form submission failed: HTTP ${submitResponse.status}`));
                                }
                            },
                            onerror: function(error) {
                                reject(new Error(`Form submission failed: ${error.error || 'Unknown error'}`));
                            },
                            ontimeout: function() {
                                reject(new Error('Form submission timed out'));
                            },
                            timeout: CONSTANTS.TIMEOUTS.HTTP_REQUEST
                        });

                    } catch (parseError) {
                        reject(new Error(`Failed to parse edit page: ${parseError.message}`));
                    }
                },
                onerror: function(error) {
                    reject(new Error(`Failed to fetch edit page: ${error.error || 'Unknown error'}`));
                },
                ontimeout: function() {
                    reject(new Error('Edit page fetch timed out'));
                },
                timeout: CONSTANTS.TIMEOUTS.HTTP_REQUEST
            });
        });
    }

    // Handle fallback methods when URL upload fails (includes MIME checking and conversion)
    function handleFallbackMethods(imageUrl, apiKey, button) {
        return checkImageMimeType(imageUrl)
            .then(mimeType => {
                log(`MIME type detected: ${mimeType}`);
                // Check if MIME type is compatible with ptpimg
                const compatibleTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
                const isCompatible = compatibleTypes.some(type => mimeType.includes(type));
                
                if (isCompatible) {
                    // Compatible type but URL upload failed, try binary upload
                    log('Compatible MIME type, trying binary upload...', 'info');
                    button.textContent = 'Downloading image...';
                    return uploadBinaryToPtpimg(imageUrl, apiKey);
                } else {
                    // For WebP or other incompatible types, use binary upload with conversion
                    log(`Incompatible MIME type (${mimeType}), using binary upload with conversion`, 'info');
                    button.textContent = 'Downloading image...';
                    return uploadBinaryToPtpimg(imageUrl, apiKey);
                }
            })
            .catch(mimeError => {
                // If MIME check fails, try binary upload anyway (might work)
                log(`MIME check failed: ${mimeError.message}, trying binary upload anyway`, 'warning');
                button.textContent = 'Downloading image...';
                return uploadBinaryToPtpimg(imageUrl, apiKey);
            });
    }

    // Main rehost function
    function rehostImage(imageUrl, button, coverInfo = null) {
        const originalText = button.textContent;
        button.disabled = true;
        
        // Make button non-clickable (convert to plain text)
        button.style.pointerEvents = 'none';
        button.style.color = '#999';
        button.style.textDecoration = 'none';

        // Get API key
        let apiKey = getApiKey();
        if (!apiKey) {
            apiKey = prompt('Please enter your PTPimg API key:');
            if (!apiKey || !apiKey.trim()) {
                button.textContent = 'API key required';
                setTimeout(() => {
                    button.textContent = originalText;
                    button.disabled = false;
                    button.style.pointerEvents = 'auto';
                    button.style.color = '';
                    button.style.textDecoration = '';
                }, CONSTANTS.TIMEOUTS.SUCCESS_DISPLAY);
                return;
            }
            setApiKey(apiKey.trim());
            apiKey = apiKey.trim();
        }

        button.textContent = 'Processing image...';

        // Darken the target image to indicate rehosting has started
        darkenTargetImage(imageUrl);

        // Extract original URL if this is a cached image
        const originalImageUrl = extractOriginalImageUrl(imageUrl);
        
        // Optimize Amazon URLs for higher quality
        let optimizedImageUrl = optimizeAmazonUrl(originalImageUrl);
        
        // Resolve any redirects to get the final URL
        // This is critical for URLs with 301/302 redirects that don't have CORS headers on the redirect itself
        button.textContent = 'Resolving URL...';
        resolveRedirects(optimizedImageUrl)
            .then(finalImageUrl => {
                log(`Final resolved URL: ${finalImageUrl}`);
                
                // Try URL upload to ptpimg first without checking MIME type (no server contact)
                button.textContent = 'Uploading to PTPimg...';
                return uploadUrlToPtpimg(finalImageUrl, apiKey)
                    .catch(urlError => {
                        log(`URL upload failed: ${urlError.message}`, 'warning');
                        
                        // Check if fallbacks are enabled
                        const fallbackSetting = getFallbackSetting();
                        if (!fallbackSetting) {
                            throw new Error('Upload failed and fallbacks are disabled');
                        }
                        
                        log('Fallbacks enabled, attempting advanced methods...', 'info');
                        button.textContent = 'Checking image type...';
                        
                        // If optimized URL failed, try original URL first
                        if (optimizedImageUrl !== originalImageUrl) {
                            log(`Trying original URL: ${originalImageUrl}`, 'info');
                            return resolveRedirects(originalImageUrl)
                                .then(resolvedOriginalUrl => {
                                    return uploadUrlToPtpimg(resolvedOriginalUrl, apiKey);
                                })
                                .catch(originalUrlError => {
                                    log(`Original URL upload also failed: ${originalUrlError.message}`, 'warning');
                                    return handleFallbackMethods(finalImageUrl, apiKey, button);
                                });
                        } else {
                            return handleFallbackMethods(finalImageUrl, apiKey, button);
                        }
                    });
            })
            .then(ptpimgUrl => {
                button.textContent = 'Updating cover...';

                // Update cover image (main or alternative) or artist image
                if (coverInfo && coverInfo.isAlternative) {
                    return replaceAlternativeCover(ptpimgUrl, coverInfo);
                } else if (isArtistPage()) {
                    return updateArtistImage(ptpimgUrl);
                } else {
                    return updateCoverImage(ptpimgUrl);
                }
            })
            .then((ptpimgUrl) => {
                // Increment the successful recover counter
                const totalRecovered = incrementRecoverCounter();
                
                // Update button with success message and counter
                button.innerHTML = `Success!<br>Total ReCovered: ${totalRecovered}`;
                button.style.color = '#4CAF50'; // Green color for success

                // Update the image with transition effect
                // Note: imageUrl here is the URL we actually processed (could be lightbox URL)
                updateImageWithTransition(imageUrl, ptpimgUrl, button, false); // false = don't fade out
            })
            .catch(error => {
                log(`Rehost failed: ${error.message}`, 'error');
                
                // Restore original image appearance
                const targetImage = findTargetImage(imageUrl);
                if (targetImage) {
                    const originalFilter = targetImage.getAttribute('data-original-filter') || '';
                    targetImage.style.filter = originalFilter;
                    targetImage.removeAttribute('data-original-filter');
                }
                
                // Check if this is a 403 anti-hotlinking error
                const is403Error = error.message.includes('403') || error.message.includes('Forbidden');
                
                if (is403Error) {
                    button.textContent = 'Anti-hotlinking protection detected';
                    button.style.color = '#ff9800'; // Orange for warning
                    button.title = 'This server blocks automated downloads. Please rehost manually:\n1. Open image in new tab\n2. Save to your computer\n3. Upload to ptpimg.me\n4. Use that URL';
                    
                    // Don't auto-restore for 403 - keep the message visible longer
                    setTimeout(() => {
                        button.textContent = 'Manual rehost required';
                        button.title = 'Server blocks automated downloads. Click for instructions.';
                        button.onclick = (e) => {
                            e.preventDefault();
                            alert('Anti-hotlinking protection detected!\n\nTo rehost this image:\n\n1. Right-click the image → Open in new tab\n2. Right-click → Save image to your computer\n3. Go to https://ptpimg.me\n4. Upload the saved image\n5. Use the ptpimg URL on this page\n\nSorry for the inconvenience - the source server blocks automated downloads.');
                        };
                    }, 2000);
                } else {
                    button.textContent = `Failed: ${error.message}`;
                    button.style.color = '#f44336'; // Red color for error
                    setTimeout(() => {
                        button.textContent = originalText;
                        button.disabled = false;
                        button.style.pointerEvents = 'auto';
                        button.style.color = '';
                        button.style.textDecoration = '';
                    }, CONSTANTS.TIMEOUTS.ERROR_DISPLAY);
                }
            });
    }

    // Create rehost button
    function createRehostButton(imageUrl, coverInfo = null) {
        const container = DOM.div({ className: 'w7_recover-button-container' });
        
        const button = DOM.a({
            href: '#',
            className: 'brackets w7_recover-main-button',
            textContent: 'Re-Host on ptpimg'
        });

        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation(); // Prevent event bubbling that might interfere with other page functionality
            rehostImage(imageUrl, button, coverInfo);
        });

        const settingsIcon = DOM.a({
            href: '#',
            innerHTML: '⚙',
            title: 'Settings',
            className: 'w7_recover-settings-icon'
        });

        const settingsPanel = DOM.div({ className: 'w7_recover-settings-panel' });

        // API Key setting
        const apiKeyLabel = DOM.label({
            textContent: 'PTPimg API Key:',
            className: 'w7_recover-settings-label'
        });

        const apiKeyInput = DOM.input({
            type: 'password',
            value: getApiKey() || '',
            placeholder: 'Enter your PTPimg API key',
            className: 'w7_recover-api-input'
        });

        // Fallbacks setting
        const fallbacksCheckbox = DOM.input({
            type: 'checkbox',
            className: 'w7_recover-fallbacks-checkbox',
            checked: getFallbackSetting()
        });

        const fallbacksText = DOM.span({
            textContent: 'Enable fallbacks?',
            className: 'w7_recover-fallbacks-text'
        });

        const fallbacksLabel = DOM.label({
            className: 'w7_recover-fallbacks-label',
            title: 'When enabled, additional methods will be used to ensure the upload completes successfully by requesting the source image through your browser'
        }, [fallbacksCheckbox, fallbacksText]);

        // Save button container
        const saveButton = DOM.button({ textContent: 'Save' });
        const closeLink = DOM.a({
            href: '#',
            textContent: 'Close',
            className: 'w7_recover-close-link'
        });

        const closeContainer = DOM.div({ className: 'w7_recover-close-container' }, [closeLink]);
        const saveContainer = DOM.div({ className: 'w7_recover-save-container' }, [saveButton, closeContainer]);

        // Event handlers
        settingsIcon.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation(); // Prevent event bubbling that might interfere with other page functionality
            const computedStyle = window.getComputedStyle(settingsPanel);
            const isVisible = computedStyle.display !== 'none';
            if (isVisible) {
                settingsPanel.style.display = 'none';
                settingsPanel.removeAttribute('data-user-opened');
            } else {
                settingsPanel.style.display = 'block';
                settingsPanel.setAttribute('data-user-opened', 'true');
            }
        });

        saveButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation(); // Prevent event bubbling that might interfere with other page functionality
            // Save API key
            const apiKey = apiKeyInput.value.trim();
            if (apiKey) {
                setApiKey(apiKey);
            }
            
            // Save fallback setting
            setFallbackSetting(fallbacksCheckbox.checked);
            
            // Close panel
            settingsPanel.style.display = 'none';
            settingsPanel.removeAttribute('data-user-opened');
            
            // Change settings icon to green checkmark
            const originalIcon = settingsIcon.innerHTML;
            const originalColor = settingsIcon.style.color;
            settingsIcon.innerHTML = '✓';
            settingsIcon.style.color = '#4CAF50';
            
            // Show brief success message on button
            const originalText = saveButton.textContent;
            saveButton.textContent = 'Saved!';
            
            // Revert everything back after 3 seconds
            setTimeout(() => {
                saveButton.textContent = originalText;
                settingsIcon.innerHTML = originalIcon;
                settingsIcon.style.color = originalColor;
            }, CONSTANTS.TIMEOUTS.SUCCESS_DISPLAY);
        });

        closeLink.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation(); // Prevent event bubbling that might interfere with other page functionality
            settingsPanel.style.display = 'none';
            settingsPanel.removeAttribute('data-user-opened');
        });

        // Build the settings panel
        [apiKeyLabel, apiKeyInput, fallbacksLabel, saveContainer].forEach(el => settingsPanel.appendChild(el));

        // Build the container
        [button, settingsIcon, settingsPanel].forEach(el => container.appendChild(el));

        return container;
    }

    // Replace alternative cover by removing old and adding new
    function replaceAlternativeCover(newImageUrl, coverInfo) {
        return new Promise((resolve, reject) => {
            const { groupId, authKey } = getPageData();
            
            log(`Alternative cover replacement debug:
                - groupId: ${groupId}
                - authKey: ${authKey ? 'present' : 'missing'}
                - removeUrl: ${coverInfo?.removeUrl || 'missing'}
                - summary: "${coverInfo?.summary || ''}"
                - isAlternative: ${coverInfo?.isAlternative}`);
            
            if (!groupId || !authKey || !coverInfo?.removeUrl) {
                reject(new Error(`Missing required data for alternative cover replacement:
                    groupId: ${groupId ? 'OK' : 'MISSING'}
                    authKey: ${authKey ? 'OK' : 'MISSING'}
                    removeUrl: ${coverInfo?.removeUrl ? 'OK' : 'MISSING'}`));
                return;
            }

            log('Replacing alternative cover with rehost summary');

            // Step 1: Remove the existing alternative cover
            GM_xmlhttpRequest({
                method: 'GET',
                url: coverInfo.removeUrl,
                onload: function(response) {
                    if (response.status !== 200) {
                        reject(new Error(`Failed to remove old cover: HTTP ${response.status}`));
                        return;
                    }

                    log('Old alternative cover removed, adding new one...');

                    // Step 2: Add the new alternative cover
                    const formData = new FormData();
                    formData.append('action', 'add_cover_art');
                    formData.append('auth', authKey);
                    formData.append('groupid', groupId);
                    formData.append('image[]', newImageUrl);
                    // Preserve original title/summary if it exists, otherwise use generic message
                    formData.append('summary[]', coverInfo.summary || 'Rehosted cover image via ReCover');

                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: `${window.location.origin}/torrents.php`,
                        data: formData,
                        onload: function(addResponse) {
                            if (addResponse.status === 200) {
                                log('Alternative cover added successfully', 'success');
                                resolve(newImageUrl);
                            } else {
                                reject(new Error(`Failed to add new cover: HTTP ${addResponse.status}`));
                            }
                        },
                        onerror: function(error) {
                            reject(new Error(`Failed to add new cover: ${error.error || 'Unknown error'}`));
                        },
                        ontimeout: function() {
                            reject(new Error('Add cover request timed out'));
                        },
                        timeout: CONSTANTS.TIMEOUTS.HTTP_REQUEST
                    });
                },
                onerror: function(error) {
                    reject(new Error(`Failed to remove old cover: ${error.error || 'Unknown error'}`));
                },
                ontimeout: function() {
                    reject(new Error('Remove cover request timed out'));
                },
                timeout: CONSTANTS.TIMEOUTS.HTTP_REQUEST
            });
        });
    }

    // Extract alternative cover information
    function getAlternativeCoverInfo(coverDiv) {
        const removeLink = coverDiv.querySelector('.remove_cover_art a');
        if (!removeLink) {
            log('No remove link found for alternative cover');
            return null;
        }

        // Extract remove URL from onclick
        const onclickAttr = removeLink.getAttribute('onclick');
        const urlMatch = onclickAttr.match(/ajax\.get\('([^']+)'/);;
        if (!urlMatch) {
            log('Could not extract remove URL from onclick attribute');
            return null;
        }

        // Extract summary text (may not exist for some covers)
        let summary = '';
        const summaryElement = coverDiv.querySelector('.stats li');
        if (summaryElement) {
            const summaryText = summaryElement.textContent.trim();
            // Remove the "X" from the end
            summary = summaryText.replace(/\s*X\s*$/, '').trim();
        }

        const coverInfo = {
            isAlternative: true,
            removeUrl: `${window.location.origin}/${urlMatch[1]}`,
            summary: summary
        };

        log(`Alternative cover info extracted:`, coverInfo);
        return coverInfo;
    }

    // Check and add rehost buttons to PTP cover images
    function checkPTPCoverImages() {
        log('Checking PTP cover images');
        
        // Find the sidebar cover image
        const coverImage = document.querySelector('.sidebar-cover-image');
        if (!coverImage) {
            log('No PTP cover image found');
            return;
        }
        
        // Get image URL - prefer lightbox URL (high-res) over src when available
        let imageUrl = null;
        
        // First try to get high-res URL from lightbox onclick
        const lightboxUrl = extractLightboxUrl(coverImage);
        if (lightboxUrl && !lightboxUrl.includes('torrents.php')) {
            imageUrl = lightboxUrl.trim();
            log(`PTP cover using lightbox URL: ${imageUrl}`);
        } else if (coverImage.src) {
            imageUrl = coverImage.src;
        }
        
        if (!imageUrl) {
            log('PTP cover image has no src');
            return;
        }
        
        // Extract original URL if this is a cached image
        const originalImageUrl = extractOriginalImageUrl(imageUrl);
        
        log(`Found PTP cover image: ${originalImageUrl}`);
        
        if (isPtpimgUrl(originalImageUrl)) {
            log('PTP cover is already on PTPimg');
            return;
        }
        
        if (isStaticImage(originalImageUrl)) {
            log('PTP cover is a static/default image, skipping');
            return;
        }
        
        // Find the panel body that contains the image
        const panelBody = coverImage.closest('.panel__body');
        if (!panelBody) {
            log('Could not find panel body for PTP cover');
            return;
        }
        
        // Check if button already exists
        if (panelBody.querySelector('.w7_recover-container')) {
            log('Rehost button already exists for PTP cover');
            return;
        }
        
        // Create and add the rehost button
        const buttonContainer = createRehostButton(imageUrl);
        buttonContainer.classList.add('w7_recover-container');
        panelBody.appendChild(buttonContainer);
        log('Added rehost button for PTP cover image');
    }

    // Check and add rehost buttons to artist images
    function checkArtistImages() {
        // Look for the artist image in the sidebar
        const sidebar = document.querySelector('.sidebar');
        if (!sidebar) {
            log('No sidebar found on artist page');
            return;
        }

        // Find the box with the artist image
        const imageBox = sidebar.querySelector('.box.box_image');
        if (!imageBox) {
            log('No image box found in sidebar');
            return;
        }

        // Find the image element
        const img = imageBox.querySelector('img');
        if (!img) {
            log('No image found in image box');
            return;
        }

        // Get image URL - prefer lightbox URL (high-res) over src when available
        let imageUrl = null;
        
        // First try to get high-res URL from lightbox onclick
        const lightboxUrl = extractLightboxUrl(img);
        if (lightboxUrl && !lightboxUrl.includes('torrents.php')) {
            imageUrl = lightboxUrl.trim();
            log(`Artist image using lightbox URL: ${imageUrl}`);
        } else if (img.src) {
            imageUrl = img.src;
        }
        
        if (!imageUrl) {
            log('Image has no src attribute');
            return;
        }

        // Extract original URL if this is a cached image
        const originalImageUrl = extractOriginalImageUrl(imageUrl);
        
        log(`Found artist image: ${originalImageUrl}`);

        if (isPtpimgUrl(originalImageUrl)) {
            log('Artist image is already on PTPimg');
            return;
        }

        if (isStaticImage(originalImageUrl)) {
            log('Artist image is a static/default image, skipping');
            return;
        }

        // Check if button already exists
        if (imageBox.querySelector('.w7_recover-container')) {
            log('Rehost button already exists for artist image');
            return;
        }

        // Create and add the rehost button
        const buttonContainer = createRehostButton(imageUrl);
        buttonContainer.classList.add('w7_recover-container');
        
        // Find the div that contains the image and add the button after it
        const imageDiv = imageBox.querySelector('div[style*="text-align: center"]');
        if (imageDiv) {
            imageDiv.appendChild(buttonContainer);
            log('Added rehost button for artist image');
        } else {
            // Fallback: add to the end of the image box
            imageBox.appendChild(buttonContainer);
            log('Added rehost button for artist image (fallback position)');
        }
    }

    // Check and add rehost buttons to cover images
    function checkCoverImages() {
        // Site-specific cover detection
        if (SITE.isPTP()) {
            return checkPTPCoverImages();
        }
        
        // RED cover detection
        const coversDiv = document.getElementById('covers');
        if (!coversDiv) {
            log('No covers div found');
            return;
        }

        log(`Covers div found: ${coversDiv.outerHTML.substring(0, 200)}...`);

        // Find all cover divs (including hidden alternative covers)
        const coverDivs = coversDiv.querySelectorAll('[id^="cover_div_"]');
        log(`Found ${coverDivs.length} cover div(s)`);

        if (coverDivs.length === 0) {
            log('No cover divs found, falling back to img search');
            // Fallback to original method
            const images = coversDiv.querySelectorAll('img');
            log(`Found ${images.length} image(s) via fallback`);

            images.forEach((img, index) => {
                // Get image URL - prefer lightbox URL (high-res) over src when available
                let imageUrl = null;
                
                // First try to get high-res URL from lightbox onclick
                const lightboxUrl = extractLightboxUrl(img);
                if (lightboxUrl && !lightboxUrl.includes('torrents.php')) {
                    imageUrl = lightboxUrl.trim();
                    log(`Fallback image ${index} using lightbox URL: ${imageUrl}`);
                } else if (img.src) {
                    imageUrl = img.src;
                }
                
                if (!imageUrl) {
                    log(`Image ${index} has no src`);
                    return;
                }

                if (isPtpimgUrl(imageUrl)) {
                    log(`Image ${index} is already on PTPimg: ${imageUrl}`);
                    return;
                }

                if (isStaticImage(imageUrl)) {
                    log(`Image ${index} is a static/default image, skipping: ${imageUrl}`);
                    return;
                }

                log(`Image ${index} needs rehosting: ${imageUrl}`);

                // Check if button already exists
                const parentDiv = img.closest('.pad');
                if (parentDiv && !parentDiv.querySelector('.w7_recover-container')) {
                    const buttonContainer = createRehostButton(imageUrl);
                    buttonContainer.classList.add('w7_recover-container');
                    parentDiv.appendChild(buttonContainer);
                    log(`Added rehost button for image ${index}`);
                }
            });
            return;
        }

        coverDivs.forEach((coverDiv, index) => {
            log(`Processing cover div ${index}: ${coverDiv.id}, classes: ${coverDiv.className}`);
            
            const img = coverDiv.querySelector('img');
            if (!img) {
                log(`Cover div ${index} has no image`);
                return;
            }

            // Get image URL - prefer lightbox URL (high-res) over src when available
            let imageUrl = null;
            
            // First try to get high-res URL from lightbox onclick
            const lightboxUrl = extractLightboxUrl(img);
            if (lightboxUrl && !lightboxUrl.includes('torrents.php')) {
                imageUrl = lightboxUrl.trim();
                log(`Cover div ${index} using lightbox URL: ${imageUrl}`);
            }
            // Fallback to data-gazelle-temp-src (alternative covers)
            else {
                const tempSrc = img.getAttribute('data-gazelle-temp-src');
                if (tempSrc && tempSrc.trim() && !tempSrc.includes('torrents.php')) {
                    imageUrl = tempSrc.trim();
                }
                // Then try regular src
                else if (img.src && img.src.trim() && !img.src.includes('torrents.php')) {
                    imageUrl = img.src.trim();
                }
            }
            
            if (!imageUrl) {
                log(`Cover div ${index} has no valid image URL (src: "${img.src}", data-gazelle-temp-src: "${tempSrc}")`);
                return;
            }

            log(`Cover div ${index} image URL: ${imageUrl}`);

            if (isPtpimgUrl(imageUrl)) {
                log(`Cover div ${index} is already on PTPimg: ${imageUrl}`);
                return;
            }

            if (isStaticImage(imageUrl)) {
                log(`Cover div ${index} is a static/default image, skipping: ${imageUrl}`);
                return;
            }

            log(`Cover div ${index} needs rehosting: ${imageUrl}`);

            // Check if this is an alternative cover
            const coverInfo = getAlternativeCoverInfo(coverDiv);
            
            // Check if button already exists - the coverDiv itself has class 'pad'
            if (coverDiv.classList.contains('pad') && !coverDiv.querySelector('.w7_recover-container')) {
                const buttonContainer = createRehostButton(imageUrl, coverInfo);
                buttonContainer.classList.add('w7_recover-container');
                coverDiv.appendChild(buttonContainer);
                log(`Added rehost button for cover div ${index}${coverInfo ? ' (alternative)' : ' (main)'}`);
            } else {
                // Fallback: look for .pad inside the coverDiv
                const parentDiv = coverDiv.querySelector('.pad');
                if (parentDiv && !parentDiv.querySelector('.w7_recover-container')) {
                    const buttonContainer = createRehostButton(imageUrl, coverInfo);
                    buttonContainer.classList.add('w7_recover-container');
                    parentDiv.appendChild(buttonContainer);
                    log(`Added rehost button for cover div ${index}${coverInfo ? ' (alternative)' : ' (main)'}`);
                } else {
                    log(`Could not find suitable parent for cover div ${index}`);
                }
            }
        });
    }

    // Track rehosted images to maintain consistency across DOM changes
    const rehostedImages = new Map(); // oldUrl -> newUrl mapping

    // Monitor DOM changes to maintain rehosted image URLs and settings panel state
    function setupImageUrlMonitor() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                // Check for attribute changes on img elements
                if (mutation.type === 'attributes' && mutation.target.tagName === 'IMG') {
                    const img = mutation.target;
                    const currentSrc = img.src;
                    const currentTempSrc = img.getAttribute('data-gazelle-temp-src');
                    
                    // Check if this image was reverted to an old URL that we've rehosted
                    rehostedImages.forEach((newUrl, oldUrl) => {
                        const originalOldUrl = extractOriginalImageUrl(oldUrl);
                        
                        if (currentSrc === oldUrl || currentSrc === originalOldUrl ||
                            currentTempSrc === oldUrl || currentTempSrc === originalOldUrl) {
                            log(`Detected reversion of rehosted image, restoring: ${currentSrc} -> ${newUrl}`);
                            img.src = newUrl;
                            if (img.hasAttribute('data-gazelle-temp-src')) {
                                img.setAttribute('data-gazelle-temp-src', newUrl);
                            }
                            
                            // Update onclick if present
                            const onclick = img.getAttribute('onclick');
                            if (onclick && onclick.includes('lightbox.init')) {
                                const updatedOnclick = onclick.replace(/lightbox\.init\('([^']+)'/, `lightbox.init('${newUrl}'`);
                                img.setAttribute('onclick', updatedOnclick);
                            }
                        }
                    });
                }
                
                // Check for newly added or modified elements
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // Handle newly added images
                            const images = node.tagName === 'IMG' ? [node] : node.querySelectorAll('img');
                            images.forEach((img) => {
                                const currentSrc = img.src;
                                const currentTempSrc = img.getAttribute('data-gazelle-temp-src');
                                
                                // Check if this new image uses an old URL that we've rehosted
                                rehostedImages.forEach((newUrl, oldUrl) => {
                                    const originalOldUrl = extractOriginalImageUrl(oldUrl);
                                    
                                    if (currentSrc === oldUrl || currentSrc === originalOldUrl ||
                                        currentTempSrc === oldUrl || currentTempSrc === originalOldUrl) {
                                        log(`Detected new image with old URL, updating: ${currentSrc} -> ${newUrl}`);
                                        img.src = newUrl;
                                        if (img.hasAttribute('data-gazelle-temp-src')) {
                                            img.setAttribute('data-gazelle-temp-src', newUrl);
                                        }
                                        
                                        // Update onclick if present
                                        const onclick = img.getAttribute('onclick');
                                        if (onclick && onclick.includes('lightbox.init')) {
                                            const updatedOnclick = onclick.replace(/lightbox\.init\('([^']+)'/, `lightbox.init('${newUrl}'`);
                                            img.setAttribute('onclick', updatedOnclick);
                                        }
                                    }
                                });
                            });
                            
                            // Handle settings panels that may have been incorrectly shown
                            const settingsPanels = node.classList && node.classList.contains('w7_recover-settings-panel') 
                                ? [node] 
                                : node.querySelectorAll('.w7_recover-settings-panel');
                            
                            settingsPanels.forEach((panel) => {
                                // If a settings panel was added or modified and is visible, hide it
                                // (unless it was intentionally opened by the user)
                                if (panel.style.display === 'block') {
                                    log('Detected settings panel incorrectly shown, hiding it');
                                    panel.style.display = 'none';
                                }
                            });
                        }
                    });
                }
                
                // Check for style attribute changes on settings panels
                if (mutation.type === 'attributes' && 
                    mutation.attributeName === 'style' && 
                    mutation.target.classList.contains('w7_recover-settings-panel')) {
                    
                    const panel = mutation.target;
                    // If the panel was set to display: block by external code (not our script), hide it
                    if (panel.style.display === 'block' && !panel.hasAttribute('data-user-opened')) {
                        log('Detected settings panel style changed to visible by external code, hiding it');
                        panel.style.display = 'none';
                    }
                }
            });
        });

        // Start observing
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['src', 'data-gazelle-temp-src', 'onclick']
        });

        log('Image URL monitor started');
        return observer;
    }

    // Initialize script
    function init() {
        log(`Initializing ReCover script on ${SITE.getCurrentSite()}`);

        // Debug storage state before migration
        debugStorageState();

        // Migrate old storage to new structure
        migrateOldStorage();

        // Debug storage state after migration
        debugStorageState();

        // Check if we're on a supported site
        if (!SITE.isRED() && !SITE.isPTP()) {
            log('Not on a supported site (RED or PTP), exiting');
            return;
        }

        // Check if we're on a supported page
        const isTorrentPage = window.location.href.includes('/torrents.php?id=');
        const isArtistPageCheck = isArtistPage();
        
        if (!isTorrentPage && !isArtistPageCheck) {
            log('Not on a supported page (torrent or artist), exiting');
            return;
        }

        log(`Site: ${SITE.getCurrentSite()}, Page type: ${isTorrentPage ? 'torrent' : 'artist'}`);

        // Setup image URL monitoring to handle DOM changes (like "show all" functionality)
        setupImageUrlMonitor();
        
        // Also add immediate cleanup for any visible settings panels
        setInterval(() => {
            document.querySelectorAll('.w7_recover-settings-panel').forEach(panel => {
                if (panel.style.display === 'block' && !panel.hasAttribute('data-user-opened')) {
                    log('Periodic cleanup: hiding incorrectly visible settings panel');
                    panel.style.display = 'none';
                }
            });
        }, 100); // Check every 100ms

        // Function to run the check with retries
        function runCheck(attempts = 0) {
            const maxAttempts = CONSTANTS.LIMITS.MAX_RETRY_ATTEMPTS;
            
            if (attempts >= maxAttempts) {
                log('Max attempts reached, giving up');
                return;
            }

            if (isTorrentPage) {
                // Check for torrent covers (site-specific)
                if (SITE.isRED()) {
                    const coversDiv = document.getElementById('covers');
                    if (!coversDiv) {
                        log(`Attempt ${attempts + 1}: No RED covers div found, retrying...`);
                        setTimeout(() => runCheck(attempts + 1), CONSTANTS.TIMEOUTS.RETRY_DELAY);
                        return;
                    }
                } else if (SITE.isPTP()) {
                    const coverImage = document.querySelector('.sidebar-cover-image');
                    if (!coverImage) {
                        log(`Attempt ${attempts + 1}: No PTP cover image found, retrying...`);
                        setTimeout(() => runCheck(attempts + 1), CONSTANTS.TIMEOUTS.RETRY_DELAY);
                        return;
                    }
                }
                checkCoverImages();
            } else if (isArtistPageCheck) {
                // Check for artist image
                const sidebar = document.querySelector('.sidebar');
                if (!sidebar) {
                    log(`Attempt ${attempts + 1}: No sidebar found, retrying...`);
                    setTimeout(() => runCheck(attempts + 1), CONSTANTS.TIMEOUTS.RETRY_DELAY);
                    return;
                }
                checkArtistImages();
            }
        }

        // Wait for page to load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(runCheck, CONSTANTS.TIMEOUTS.INIT_DELAY); // Small delay to ensure everything is loaded
            });
        } else {
            setTimeout(runCheck, CONSTANTS.TIMEOUTS.INIT_DELAY);
        }

        log('Script initialized');
    }

    // Start the script
    init();

})();
