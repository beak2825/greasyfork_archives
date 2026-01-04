// ==UserScript==
// @name         Aibooru AI Metadata On Hover
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Show AI metadata when hovering over images on Aibooru posts page
// @author       LeechKing
// @license      MIT
// @match        https://*.aibooru.online/posts*
// @match        https://*.aibooru.online/
// @match        https://*.aibooru.online
// @require      https://cdn.jsdelivr.net/npm/exifreader@4.20.0/dist/exif-reader.min.js
// @grant        GM_xmlhttpRequest
// @connect      *.aibooru.online
// @downloadURL https://update.greasyfork.org/scripts/550549/Aibooru%20AI%20Metadata%20On%20Hover.user.js
// @updateURL https://update.greasyfork.org/scripts/550549/Aibooru%20AI%20Metadata%20On%20Hover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Check if we're on a posts listing page (not individual post page)
    const currentUrl = window.location.pathname;
    const isPostsListingPage = /^\/posts\/?$/i.test(currentUrl) || 
                              currentUrl === '/posts' || 
                              currentUrl === '/' || 
                              currentUrl === '';
    
    // Exit early if we're on an individual post page (e.g., /posts/134262)
    if (!isPostsListingPage) {
        console.log('Aibooru Metadata Hover: Not on posts listing page, exiting...');
        return;
    }
    
    console.log('Aibooru Metadata Hover: On posts listing page, initializing...');

    // Cache for storing fetched metadata to avoid repeated requests
    const metadataCache = new Map();
    
    // Create and style the metadata display div
    const metadataDiv = document.createElement('div');
    metadataDiv.id = 'aibooru-metadata-tooltip';
    metadataDiv.style.cssText = `
        position: fixed;
        background: rgba(0, 0, 0, 0.95);
        color: white;
        padding: 20px;
        border-radius: 8px;
        border: 2px solid #4a90e2;
        max-width: 800px;
        max-height: 1000px;
        overflow-y: auto;
        z-index: 10000;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-size: 14px;
        line-height: 1.4;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        display: none;
        word-wrap: break-word;
        pointer-events: auto;
    `;
    document.body.appendChild(metadataDiv);

    // Add hover events to the tooltip itself
    metadataDiv.addEventListener('mouseenter', function() {
        isHoveringTooltip = true;
        if (closeTimeout) {
            clearTimeout(closeTimeout);
            closeTimeout = null;
        }
    });

    metadataDiv.addEventListener('mouseleave', function() {
        isHoveringTooltip = false;
        scheduleClose();
    });

    // Function to schedule tooltip closing with delay
    function scheduleClose() {
        if (closeTimeout) {
            clearTimeout(closeTimeout);
        }
        closeTimeout = setTimeout(() => {
            if (!isHoveringTooltip && !currentHoverElement) {
                hideMetadata();
            }
        }, CLOSE_DELAY);
    }

    // Function to extract post ID from various link formats
    function getPostIdFromElement(element) {
        console.log('Extracting post ID from element:', element);
        
        // Try link href first
        const link = element.closest('a[href*="/posts/"]');
        const linkMatch = link?.href.match(/\/posts\/(\d+)/);
        if (linkMatch) return linkMatch[1];
        
        // Try image src patterns (excluding hash patterns)
        const img = element.tagName === 'IMG' ? element : element.querySelector('img');
        if (img?.src) {
            const patterns = [/\/(\d+)_/, /post_(\d+)/, /\/(\d+)\//];
            for (const pattern of patterns) {
                const match = img.src.match(pattern);
                if (match) return match[1];
            }
        }
        
        // Try data attributes
        const parent = element.closest('[data-id], [data-post-id], .post');
        if (parent?.dataset.id) return parent.dataset.id;
        if (parent?.dataset.postId) return parent.dataset.postId;
        if (element.dataset?.id) return element.dataset.id;
        
        // Try parent link
        const parentLink = parent?.querySelector('a[href*="/posts/"]');
        const parentMatch = parentLink?.href.match(/\/posts\/(\d+)/);
        if (parentMatch) return parentMatch[1];
        
        console.log('Could not extract post ID from element');
        return null;
    }

    // Function to fetch AI metadata from a post page
    function fetchMetadata(postId) {
        if (metadataCache.has(postId)) return Promise.resolve(metadataCache.get(postId));

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `${window.location.origin}/posts/${postId}`,
                onload: (response) => {
                    if (response.status === 200) {
                        const metadata = extractMetadataFromPage(new DOMParser().parseFromString(response.responseText, 'text/html'));
                        metadataCache.set(postId, metadata);
                        resolve(metadata);
                    } else {
                        reject(new Error(`HTTP ${response.status}`));
                    }
                },
                onerror: reject
            });
        });
    }

    // Function to extract metadata from the fetched post page
    function extractMetadataFromPage(doc) {
        const metadata = { aiMetadataRows: [], model: '', artist: '', tags: [] };

        // Helper to extract table rows
        const extractTableRows = (table) => {
            if (!table) return;
            table.querySelectorAll('tr').forEach(row => {
                const th = row.querySelector('th');
                const td = row.querySelector('td');
                if (th && td) {
                    const label = th.textContent.trim();
                    const value = td.textContent.trim();
                    metadata.aiMetadataRows.push({ label, value });
                    console.log(`Found metadata: ${label} = ${value.substring(0, 50)}${value.length > 50 ? '...' : ''}`);
                }
            });
        };

        // Try to find AI metadata table
        const aiMetadataTable = doc.querySelector('.ai-metadata-table tbody, table.ai-metadata-table tbody, .striped.ai-metadata-table tbody') ||
                               doc.querySelector('#artist-commentary table tbody, .ai-metadata-tab table tbody');
        extractTableRows(aiMetadataTable);

        // Helper to extract section data
        const extractSection = (sectionName) => {
            const section = Array.from(doc.querySelectorAll('h4, h5, h6')).find(h => h.textContent.trim() === sectionName);
            const link = section?.parentElement.querySelector('a[href*="/posts?tags="]');
            return link?.textContent.trim() || '';
        };

        metadata.artist = extractSection('Artist');
        metadata.model = extractSection('Model');

        // Extract general tags
        const generalSection = Array.from(doc.querySelectorAll('h4, h5, h6')).find(h => h.textContent.trim() === 'General');
        if (generalSection) {
            metadata.tags = Array.from(generalSection.parentElement.querySelectorAll('a[href*="/posts?tags="]'))
                .map(a => a.textContent.trim())
                .filter(tag => tag && !tag.includes('?'))
                .slice(0, 10);
        }

        return metadata;
    }

    // Function to fetch original image URL from Aibooru API
    function getOriginalImageUrl(postId) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `${window.location.origin}/posts.json?tags=id:${postId}`,
                onload: (response) => {
                    try {
                        if (response.status !== 200) throw new Error(`API request failed with status ${response.status}`);
                        
                        const data = JSON.parse(response.responseText);
                        if (!data?.length) throw new Error('No post data found in API response');
                        
                        const originalUrl = data[0].file_url || data[0].large_file_url || data[0].preview_file_url;
                        if (!originalUrl) throw new Error('No image URL found in API response');
                        
                        console.log('Found original image URL:', originalUrl);
                        resolve(originalUrl);
                    } catch (e) {
                        reject(new Error(`Error parsing API response: ${e.message}`));
                    }
                },
                onerror: (error) => reject(new Error(`API request failed: ${error}`))
            });
        });
    }

    // Function to read image metadata with API fallback
    function readImageMetadata(postId, thumbnailUrl = null) {
        console.log('Attempting to read image metadata for post ID:', postId);
        
        return getOriginalImageUrl(postId)
            .then(originalImageUrl => {
                console.log('Got original image URL, reading metadata from:', originalImageUrl);
                return readImageFromUrl(originalImageUrl);
            })
            .catch(apiError => {
                console.log('Failed to get original URL from API:', apiError);
                if (thumbnailUrl) {
                    console.log('Falling back to thumbnail URL:', thumbnailUrl);
                    return readImageFromUrl(thumbnailUrl);
                }
                throw apiError;
            });
    }

    // Helper function to read image metadata from a specific URL
    function readImageFromUrl(imageUrl) {
        return fetch(imageUrl)
            .then(response => response.arrayBuffer())
            .then(fileBuffer => extractImageMetadata(fileBuffer))
            .catch(() => new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: imageUrl,
                    responseType: "arraybuffer",
                    onload: (res) => {
                        try {
                            resolve(extractImageMetadata(res.response));
                        } catch (e) {
                            reject(e);
                        }
                    },
                    onerror: reject
                });
            }));
    }

    // Function to extract metadata from image buffer
    function extractImageMetadata(fileBuffer) {
        const metadata = { aiMetadataRows: [], model: '', artist: '', tags: [] };
        if (!fileBuffer) return metadata;

        try {
            const tags = ExifReader.load(fileBuffer, {expanded: true});
            const prompt = getPromptFromImage(tags);
            
            // Add prompt data
            if (prompt.positive) metadata.aiMetadataRows.push({ label: 'Prompt', value: prompt.positive });
            if (prompt.negative) metadata.aiMetadataRows.push({ label: 'Negative Prompt', value: prompt.negative });
            
            if (prompt.others) {
                // Extract and add parameters in a more compact way
                const params = [
                    ['Steps', /Steps:\s*(\d+)/],
                    ['Sampler', /Sampler:\s*([^,\n]+)/],
                    ['CFG Scale', /CFG scale:\s*([\d.]+)/],
                    ['Seed', /Seed:\s*(\d+)/],
                    ['Size', /Size:\s*(\d+x\d+)/]
                ];
                
                params.forEach(([label, regex]) => {
                    const match = prompt.others.match(regex);
                    if (match) metadata.aiMetadataRows.push({ label, value: match[1].trim?.() || match[1] });
                });
                
                const modelMatch = prompt.others.match(/Model:\s*([^,\n]+)/);
                if (modelMatch) metadata.model = modelMatch[1].trim();
                
                metadata.aiMetadataRows.push({ label: 'Raw Parameters', value: prompt.others });
            }
        } catch(e) {
            console.log('Error extracting image metadata:', e);
        }

        return metadata;
    }

    // Function to extract prompt data from EXIF tags (adapted from the reference script)
    function getPromptFromImage(tags) {
        const prompt = { positive: "", negative: "", others: "" };
        let com = "";

        // Helper function to parse standard A1111 format
        const parseA1111 = (text) => {
            try {
                prompt.positive = text.match(/([^]+)Negative prompt: /)?.[1] || "";
                prompt.negative = text.match(/Negative prompt: ([^]+)Steps: /)?.[1] || "";
                prompt.others = text.match(/(Steps: [^]+)/)?.[1] || text;
            } catch (e) {
                prompt.others = text;
            }
        };

        if (tags.exif?.UserComment) {
            com = decodeUnicode(tags.exif.UserComment.value);
            if (com) parseA1111(com);
        } else if (tags.pngText?.parameters) {
            parseA1111(tags.pngText.parameters.description);
        } else if (tags.pngText?.Dream) {
            com = tags.pngText.Dream.description + (tags.pngText["sd-metadata"] ? "\r\n" + tags.pngText["sd-metadata"].description : "");
            try {
                prompt.positive = com.match(/([^]+?)\[[^[]+\]/)?.[1] || "";
                prompt.negative = com.match(/\[([^[]+?)(\]|Steps: )/)?.[1] || "";
                prompt.others = com.match(/\]([^]+)/)?.[1] || com;
            } catch (e) {
                prompt.others = com;
            }
        } else if (tags.pngText?.Comment) {
            try {
                const comment = tags.pngText.Comment.description.replaceAll(/\\u00a0/g, " ");
                const parsed = JSON.parse(comment);
                prompt.positive = tags.pngText.Description?.description || parsed.prompt || "";
                prompt.negative = parsed.uc || "";
                prompt.others = [comment, tags.pngText.Software?.description, tags.pngText.Title?.description, 
                               tags.pngText.Source?.description, tags.pngText["Generation time"] && 
                               "Generation time: " + tags.pngText["Generation time"].description].filter(Boolean).join("\r\n");
            } catch (e) {
                prompt.others = tags.pngText.Comment.description;
            }
        } else if (tags.pngText) {
            prompt.others = Object.values(tags.pngText).map(t => t.description).join("");
        }

        return prompt;
    }

    // Function to decode Unicode from EXIF data (from reference script)
    const decodeUnicode = (array) => {
        const plain = array.map(t => t.toString(16).padStart(2, "0")).join("");
        if (!plain.match(/^554e49434f44450/)) return;
        
        const hex = plain.replace(/^554e49434f44450[0-9]/, "").replace(/[0-9a-f]{4}/g, ",0x$&").replace(/^,/, "");
        return hex.split(",").map(v => String.fromCodePoint(v)).join("");
    };

    // Function to format and display metadata with improved positioning
    function displayMetadata(metadata, imageElement, isImageMetadata = false) {
        const sourceText = isImageMetadata ? ' (from image)' : '';
        let html = `<div style="margin-bottom: 15px; font-weight: bold; color: #4a90e2; border-bottom: 1px solid #4a90e2; padding-bottom: 8px; font-size: 16px;">AI Metadata${sourceText}</div>`;
        
        // Add artist and model if available
        if (metadata.artist) html += `<div style="margin-bottom: 8px;"><strong>Artist:</strong> ${escapeHtml(metadata.artist)}</div>`;
        if (metadata.model) html += `<div style="margin-bottom: 8px;"><strong>Model:</strong> ${escapeHtml(metadata.model)}</div>`;
        
        // Display AI metadata rows
        metadata.aiMetadataRows?.forEach(row => {
            const isPrompt = row.label.toLowerCase().includes('prompt');
            const bgColor = isPrompt ? (row.label.toLowerCase().includes('negative') ? 'rgba(255,100,100,0.1)' : 'rgba(255,255,255,0.1)') : '';
            
            if (isPrompt) {
                html += `<div style="margin-top: 10px;"><strong>${escapeHtml(row.label)}:</strong><br><div style="background: ${bgColor}; padding: 8px; margin-top: 5px; border-radius: 4px; font-size: 13px; max-height: 150px; overflow-y: auto; word-break: break-word;">${escapeHtml(row.value)}</div></div>`;
            } else {
                html += `<div style="margin-top: 6px;"><strong>${escapeHtml(row.label)}:</strong> ${escapeHtml(row.value)}</div>`;
            }
        });
        
        // Display tags
        if (metadata.tags?.length) {
            html += `<div style="margin-top: 12px;"><strong>Tags:</strong><br><div style="background: rgba(255,255,255,0.05); padding: 8px; margin-top: 5px; border-radius: 4px; font-size: 13px;">${metadata.tags.map(escapeHtml).join(', ')}</div></div>`;
        }
        
        // No metadata message
        const hasContent = metadata.aiMetadataRows?.length || metadata.artist || metadata.model || metadata.tags?.length;
        if (!hasContent) html += '<div style="color: #888; font-style: italic;">No AI metadata found for this image</div>';
        
        metadataDiv.innerHTML = html;
        
        // Positioning logic
        const imageRect = imageElement.getBoundingClientRect();
        const { innerWidth: windowWidth, innerHeight: windowHeight } = window;
        const marginPercent = 2;
        
        // Calculate responsive width (30% of window, clamped between 300-800px)
        const targetWidth = Math.max(300, Math.min(800, windowWidth * 0.3));
        const widthPercent = (targetWidth / windowWidth) * 100;
        
        Object.assign(metadataDiv.style, {
            width: widthPercent + '%',
            maxWidth: widthPercent + '%'
        });
        
        // Horizontal positioning based on image location
        const isImageOnLeft = (imageRect.left + imageRect.width / 2) < (windowWidth / 2);
        metadataDiv.style.left = (isImageOnLeft ? (100 - widthPercent - marginPercent) : marginPercent) + '%';
        
        // Vertical positioning with bounds checking
        const marginPx = windowHeight * marginPercent / 100;
        const preferredTop = imageRect.top;
        const updatedRect = metadataDiv.getBoundingClientRect();
        
        let top = preferredTop + updatedRect.height <= windowHeight - marginPx 
            ? Math.max(marginPx, preferredTop)
            : windowHeight - updatedRect.height - marginPx;
        
        top = Math.max(marginPx, Math.min(top, windowHeight - updatedRect.height - marginPx));
        
        Object.assign(metadataDiv.style, {
            top: top + 'px',
            display: 'block'
        });
    }

    // Utility functions
    const escapeHtml = (text) => {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    };
    
    const hideMetadata = () => metadataDiv.style.display = 'none';

    // Functions to handle image scaling
    const enlargeImage = (img, scale = 1.2) => {
        Object.assign(img.style, {
            transition: 'transform 0.3s ease, z-index 0s',
            transform: `scale(${scale})`,
            zIndex: '1000',
            position: 'relative'
        });
    };

    const restoreImage = (img) => {
        Object.assign(img.style, { transform: 'scale(1)', zIndex: '', position: '' });
    };

    // Global tracking for current hover session
    let currentHoverElement = null;
    let currentHoverSession = 0;
    let metadataFetched = false;
    let lastExecutionTime = 0;
    const MINIMUM_DELAY = 200; // 200ms minimum delay between executions
    const CLOSE_DELAY = 300; // 300ms delay before closing tooltip
    let closeTimeout = null;
    let isHoveringTooltip = false;

    // Set up event listeners for images
    function setupImageListeners() {
        // Find all images on the posts page - be more comprehensive
        const images = document.querySelectorAll('img[src*="aibooru"], img[src*="cdn."], a[href*="/posts/"] img, .post img, .post-preview img, img[src*="sample"], img[src*="preview"]');
        
        console.log(`Found ${images.length} images to process`);
        
        images.forEach(img => {
            // Skip if already processed
            if (img.dataset.metadataListener) return;
            img.dataset.metadataListener = 'true';

            let hoverTimeout;
            let isHovering = false;

            img.addEventListener('mouseenter', function(e) {
                const currentTime = Date.now();
                
                // Check minimum delay since last execution - silent skip
                if (currentTime - lastExecutionTime < MINIMUM_DELAY) {
                    return;
                }
                
                // Check if this is a new hover session - silent skip
                if (currentHoverElement === this && metadataFetched) {
                    return;
                }
                
                // Update last execution time
                lastExecutionTime = currentTime;
                
                // Start new hover session
                currentHoverElement = this;
                currentHoverSession++;
                metadataFetched = false;
                isHovering = true;
                
                console.log(`Starting hover session ${currentHoverSession} for element:`, this);
                
                enlargeImage(img);
                
                // Store initial mouse position for tooltip
                const initialX = e.clientX;
                const initialY = e.clientY;
                const sessionId = currentHoverSession; // Capture current session ID
                
                // Delay metadata fetching slightly to avoid excessive requests
                hoverTimeout = setTimeout(() => {
                    // Only proceed if this is still the current session and we haven't fetched metadata yet
                    if (!isHovering || sessionId !== currentHoverSession || metadataFetched) {
                        console.log('Hover session changed or metadata already fetched, aborting...');
                        return;
                    }
                    
                    metadataFetched = true; // Mark as fetched to prevent duplicates
                    
                    const postId = getPostIdFromElement(this);
                    if (postId) {
                        console.log(`Fetching metadata for post ID: ${postId}`);
                        
                        // Show loading indicator
                        metadataDiv.innerHTML = '<div style="text-align: center; color: #4a90e2;">Loading metadata...</div>';
                        displayMetadata({aiMetadataRows: [], tags: []}, img, false);
                        
                        fetchMetadata(postId).then(metadata => {
                            // Only show if this is still the current session
                            if (isHovering && sessionId === currentHoverSession) {
                                // Check if we got useful metadata from the page
                                const hasPageMetadata = (metadata.aiMetadataRows && metadata.aiMetadataRows.length > 0) || 
                                                      metadata.artist || metadata.model || 
                                                      (metadata.tags && metadata.tags.length > 0);
                                
                                if (hasPageMetadata) {
                                    console.log('Displaying page metadata for session:', sessionId);
                                    displayMetadata(metadata, img, false);
                                } else {
                                    // Try to get metadata from the image itself as fallback
                                    console.log('No page metadata found, trying image metadata fallback');
                                    metadataDiv.innerHTML = '<div style="text-align: center; color: #4a90e2;">Reading image metadata...</div>';
                                    displayMetadata({aiMetadataRows: [], tags: []}, img, false);
                                    
                                    readImageMetadata(postId, img.src).then(imageMetadata => {
                                        if (isHovering && sessionId === currentHoverSession) {
                                            if (imageMetadata.aiMetadataRows && imageMetadata.aiMetadataRows.length > 0) {
                                                console.log('Displaying image metadata for session:', sessionId);
                                                displayMetadata(imageMetadata, img, true);
                                            } else {
                                                console.log('No metadata found in image either');
                                                metadataDiv.innerHTML = '<div style="color: #888; font-style: italic;">No AI metadata found for this image</div>';
                                                displayMetadata({aiMetadataRows: [], tags: []}, img, false);
                                            }
                                        }
                                    }).catch(imageError => {
                                        if (isHovering && sessionId === currentHoverSession) {
                                            console.log('Error reading image metadata:', imageError);
                                            metadataDiv.innerHTML = '<div style="color: #888; font-style: italic;">No AI metadata found for this image</div>';
                                            displayMetadata({aiMetadataRows: [], tags: []}, img, false);
                                        }
                                    });
                                }
                            } else {
                                console.log('Session changed, not displaying metadata');
                            }
                        }).catch(error => {
                            if (isHovering && sessionId === currentHoverSession) {
                                console.log('Error fetching page metadata, trying image metadata fallback:', error);
                                metadataDiv.innerHTML = '<div style="text-align: center; color: #4a90e2;">Reading image metadata...</div>';
                                displayMetadata({aiMetadataRows: [], tags: []}, img, false);
                                
                                readImageMetadata(postId, img.src).then(imageMetadata => {
                                    if (isHovering && sessionId === currentHoverSession) {
                                        if (imageMetadata.aiMetadataRows && imageMetadata.aiMetadataRows.length > 0) {
                                            console.log('Displaying fallback image metadata for session:', sessionId);
                                            displayMetadata(imageMetadata, img, true);
                                        } else {
                                            metadataDiv.innerHTML = '<div style="color: #ff6b6b;">Failed to load metadata</div>';
                                            displayMetadata({aiMetadataRows: [], tags: []}, img, false);
                                        }
                                    }
                                }).catch(imageError => {
                                    if (isHovering && sessionId === currentHoverSession) {
                                        console.log('Error with both page and image metadata:', imageError);
                                        metadataDiv.innerHTML = '<div style="color: #ff6b6b;">Failed to load metadata</div>';
                                        displayMetadata({aiMetadataRows: [], tags: []}, img, false);
                                    }
                                });
                            }
                        });
                    } else {
                        if (isHovering && sessionId === currentHoverSession) {
                            console.log('Post ID not found');
                            metadataDiv.innerHTML = '<div style="color: #888;">Post ID not found</div>';
                            displayMetadata({aiMetadataRows: [], tags: []}, img, false);
                        }
                    }
                }, 300);
            });

            img.addEventListener('mouseleave', function() {
                console.log(`Mouse left element, ending hover session ${currentHoverSession}`);
                isHovering = false;
                clearTimeout(hoverTimeout);
                restoreImage(img);
                
                // Reset hover tracking when leaving the element
                currentHoverElement = null;
                metadataFetched = false;
                currentHoverSession++;
                
                // Schedule tooltip closing with delay
                scheduleClose();
            });
        });
    }

    // Initial setup
    setupImageListeners();

    // Re-setup listeners when new content is loaded (for infinite scroll or dynamic content)
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length > 0) {
                // Delay to ensure new images are properly loaded
                setTimeout(setupImageListeners, 100);
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Hide metadata when clicking elsewhere
    document.addEventListener('click', function(e) {
        // Don't hide if clicking on the tooltip itself
        if (!metadataDiv.contains(e.target)) {
            if (closeTimeout) {
                clearTimeout(closeTimeout);
                closeTimeout = null;
            }
            hideMetadata();
        }
    });
    
    console.log('Aibooru AI Metadata Hover userscript loaded successfully!');
})();
