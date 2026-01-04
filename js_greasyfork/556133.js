// ==UserScript==
// @name        SpankBang always show download urls
// @namespace   Violentmonkey Scripts
// @match       https://spankbang.com/*
// @grant       none
// @version     1.2
// @author      Yumeo
// @license     GNU GPLv3
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @description 11/17/2025, 9:58:08 PM
// @downloadURL https://update.greasyfork.org/scripts/556133/SpankBang%20always%20show%20download%20urls.user.js
// @updateURL https://update.greasyfork.org/scripts/556133/SpankBang%20always%20show%20download%20urls.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Settings storage key
    const STORAGE_KEY = 'spankbang_settings';

    // Load settings from localStorage
    function loadSettings() {
        const defaults = {
            filterLikedVideos: false
        };
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? { ...defaults, ...JSON.parse(stored) } : defaults;
        } catch (e) {
            console.error('Error loading settings:', e);
            return defaults;
        }
    }

    // Save settings to localStorage
    function saveSettings(settings) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        } catch (e) {
            console.error('Error saving settings:', e);
        }
    }

    // Get current settings
    let settings = loadSettings();

    // Cache for liked video checks to avoid refetching
    const likedVideoCache = new Map();

    // Function to create a custom popup with download buttons
    function createDownloadPopup(videoData) {
        // Create the custom popup container
        const popup = document.createElement('div');
        popup.id = 'custom-download-popup';
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.backgroundColor = '#1a1a1a';
        popup.style.border = '2px solid #dc3545';
        popup.style.borderRadius = '12px';
        popup.style.padding = '30px';
        popup.style.paddingTop = '60px';
        popup.style.zIndex = '9999';
        popup.style.boxShadow = '0 10px 40px rgba(220, 53, 69, 0.3)';
        popup.style.maxWidth = '500px';
        popup.style.minWidth = '400px';
        popup.style.textAlign = 'center';
        popup.style.fontFamily = 'system-ui, -apple-system, sans-serif';

        // Create backdrop overlay
        const backdrop = document.createElement('div');
        backdrop.style.position = 'fixed';
        backdrop.style.top = '0';
        backdrop.style.left = '0';
        backdrop.style.width = '100%';
        backdrop.style.height = '100%';
        backdrop.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        backdrop.style.zIndex = '9998';
        backdrop.style.backdropFilter = 'blur(4px)';

        // Create a list of download options (buttons)
        const downloadList = document.createElement('div');
        downloadList.style.display = 'flex';
        downloadList.style.flexDirection = 'column';
        downloadList.style.gap = '12px';

        videoData.forEach((video) => {
            const button = document.createElement('button');
            button.classList.add('download-btn');
            button.style.padding = '14px 20px';
            button.style.backgroundColor = '#2d2d2d';
            button.style.color = '#ffffff';
            button.style.border = '2px solid #dc3545';
            button.style.borderRadius = '8px';
            button.style.cursor = 'pointer';
            button.style.width = '100%';
            button.style.fontSize = '15px';
            button.style.fontWeight = '500';
            button.style.transition = 'all 0.3s ease';
            button.textContent = `Download in ${video.res} quality`;

            // Hover effects
            button.addEventListener('mouseenter', () => {
                button.style.backgroundColor = '#dc3545';
                button.style.transform = 'translateY(-2px)';
                button.style.boxShadow = '0 4px 12px rgba(220, 53, 69, 0.4)';
            });

            button.addEventListener('mouseleave', () => {
                button.style.backgroundColor = '#2d2d2d';
                button.style.transform = 'translateY(0)';
                button.style.boxShadow = 'none';
            });

            // Add the URL to the button's click event
            button.addEventListener('click', () => {
                console.log("Opening " + video.url);

                // Create a temporary anchor element for download
                const link = document.createElement('a');
                link.href = video.url;
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                link.download = ''; // Triggers download behavior

                // Append to body, click, and remove
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                // Close popup after a short delay
                setTimeout(() => {
                    document.body.removeChild(backdrop);
                    document.body.removeChild(popup);
                }, 100);
            });

            downloadList.appendChild(button);
        });

        // Append the download list to the popup
        popup.appendChild(downloadList);

        // Close button
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '✕';
        closeBtn.style.position = 'absolute';
        closeBtn.style.top = '15px';
        closeBtn.style.right = '15px';
        closeBtn.style.backgroundColor = 'transparent';
        closeBtn.style.border = 'none';
        closeBtn.style.color = '#dc3545';
        closeBtn.style.fontSize = '24px';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.width = '30px';
        closeBtn.style.height = '30px';
        closeBtn.style.display = 'flex';
        closeBtn.style.alignItems = 'center';
        closeBtn.style.justifyContent = 'center';
        closeBtn.style.transition = 'transform 0.2s ease';

        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.transform = 'rotate(90deg)';
        });

        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.transform = 'rotate(0deg)';
        });

        closeBtn.addEventListener('click', () => {
            document.body.removeChild(backdrop);
            document.body.removeChild(popup);
        });

        popup.appendChild(closeBtn);

        // Close when clicking backdrop
        backdrop.addEventListener('click', () => {
            document.body.removeChild(backdrop);
            document.body.removeChild(popup);
        });

        // Append backdrop and popup to the body
        document.body.appendChild(backdrop);
        document.body.appendChild(popup);
    }

    // Function to extract video URLs and create an array of video data
    function extractVideoUrls() {
        const videoData = []; // Array to hold video objects

        // Find all <script> tags on the page
        const scripts = document.getElementsByTagName('script');

        for (let script of scripts) {
            if (script.innerHTML.includes('var ana_video_id')) {
                // Get the content of the script
                const scriptContent = script.innerHTML;

                // Look for the 'stream_data' definition using a regular expression
                const match = scriptContent.match(/var stream_data = (\{.*?\});/s);

                if (match) {
                    try {
                        // Extract the stream_data object from the script content
                        const streamData = eval('(' + match[1] + ')');  // Use eval to safely execute the code and extract the object

                        // Loop through each resolution (keys in the streamData object)
                        Object.entries(streamData).forEach(([res, urlArray]) => {
                            // Ensure urlArray is an array or a string before trying to loop through it
                            if (Array.isArray(urlArray)) {
                                urlArray.forEach(url => {
                                    // Filter out .m3u8 and .jpg files
                                    if (!url.includes('.m3u8') && !url.includes('.jpg')) {
                                        videoData.push({
                                            res: res,
                                            url: url
                                        });
                                    }
                                });
                            } else if (typeof urlArray === 'string') {
                                // Filter out .m3u8 and .jpg files
                                if (!urlArray.includes('.m3u8') && !urlArray.includes('.jpg')) {
                                    videoData.push({
                                        res: res,
                                        url: urlArray
                                    });
                                }
                            }
                        });

                        console.log(videoData);
                    } catch (e) {
                        console.error('Error evaluating stream_data:', e);
                    }
                }
            }
        }

        // After extracting the video URLs, create the custom download popup
        createDownloadPopup(videoData);
    }

    // Replace the download button's default behavior by observing DOM for `.dl` nodes
    const attachDlHandler = (el) => {
        if (el.__downloadHandlerAttached) return;
        const handler = (e) => {
            e.preventDefault();
            e.stopPropagation();
            extractVideoUrls();
        };
        el.addEventListener('click', handler, true);
        el.__downloadHandlerAttached = true;
    };

    // Adds a settings button (gear) into the .top.main_content_container element
    const addSettingsButton = () => {
        const container = document.querySelector('.top.main_content_container');
        if (!container) return;
        if (container.querySelector('#gm-settings-btn')) return; // already added

        // Ensure container is positioned so absolute children align correctly
        const cs = getComputedStyle(container);
        if (cs.position === 'static') container.style.position = 'relative';

        const btn = document.createElement('button');
        btn.id = 'gm-settings-btn';
        btn.title = 'Settings';
        btn.setAttribute('aria-label', 'Settings');
        btn.innerHTML = '<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path fill="#000000" d="M600.704 64a32 32 0 0 1 30.464 22.208l35.2 109.376c14.784 7.232 28.928 15.36 42.432 24.512l112.384-24.192a32 32 0 0 1 34.432 15.36L944.32 364.8a32 32 0 0 1-4.032 37.504l-77.12 85.12a357.12 357.12 0 0 1 0 49.024l77.12 85.248a32 32 0 0 1 4.032 37.504l-88.704 153.6a32 32 0 0 1-34.432 15.296L708.8 803.904c-13.44 9.088-27.648 17.28-42.368 24.512l-35.264 109.376A32 32 0 0 1 600.704 960H423.296a32 32 0 0 1-30.464-22.208L357.696 828.48a351.616 351.616 0 0 1-42.56-24.64l-112.32 24.256a32 32 0 0 1-34.432-15.36L79.68 659.2a32 32 0 0 1 4.032-37.504l77.12-85.248a357.12 357.12 0 0 1 0-48.896l-77.12-85.248A32 32 0 0 1 79.68 364.8l88.704-153.6a32 32 0 0 1 34.432-15.296l112.32 24.256c13.568-9.152 27.776-17.408 42.56-24.64l35.2-109.312A32 32 0 0 1 423.232 64H600.64zm-23.424 64H446.72l-36.352 113.088-24.512 11.968a294.113 294.113 0 0 0-34.816 20.096l-22.656 15.36-116.224-25.088-65.28 113.152 79.68 88.192-1.92 27.136a293.12 293.12 0 0 0 0 40.192l1.92 27.136-79.808 88.192 65.344 113.152 116.224-25.024 22.656 15.296a294.113 294.113 0 0 0 34.816 20.096l24.512 11.968L446.72 896h130.688l36.48-113.152 24.448-11.904a288.282 288.282 0 0 0 34.752-20.096l22.592-15.296 116.288 25.024 65.28-113.152-79.744-88.192 1.92-27.136a293.12 293.12 0 0 0 0-40.256l-1.92-27.136 79.808-88.128-65.344-113.152-116.288 24.96-22.592-15.232a287.616 287.616 0 0 0-34.752-20.096l-24.448-11.904L577.344 128zM512 320a192 192 0 1 1 0 384 192 192 0 0 1 0-384zm0 64a128 128 0 1 0 0 256 128 128 0 0 0 0-256z"/></svg>';
        Object.assign(btn.style, {
            borderRadius: '6px',
            background: 'linear-gradient(rgb(255, 218, 70), rgb(249, 159, 6))',
            color: '#fff',
            cursor: 'pointer'
        });

        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'scale(1.05)';
            btn.style.transition = 'transform .15s';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'scale(1)';
        });

        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleSettingsPanel();
        });

        container.appendChild(btn);

        // Make the button square by matching its width to its computed height
        btn.style.boxSizing = 'border-box';
        const setSquare = () => {
            const h = getComputedStyle(btn).height;
            if (h && h !== '0px') btn.style.width = h;
        };
        // Initial set and keep in sync on resize/layout changes
        setSquare();
        if (window.ResizeObserver) {
            const ro = new ResizeObserver(setSquare);
            ro.observe(btn);
            btn._gm_resizeObserver = ro;
        }
    };

    // Fetch and check if a video is liked (async, but we don't wait for it)
    function fetchVideoLikedStatus(videoItem) {
        const linkElement = videoItem.querySelector('a[href*="/video/"]');
        if (!linkElement) return;

        const videoUrl = linkElement.href;

        // Already cached or being fetched
        if (likedVideoCache.has(videoUrl)) return;

        // Mark as pending to avoid duplicate fetches
        likedVideoCache.set(videoUrl, null);

        // Fetch in background
        fetch(videoUrl)
            .then(response => {
                if (!response.ok) {
                    likedVideoCache.delete(videoUrl);
                    return null;
                }
                return response.text();
            })
            .then(html => {
                if (html === null) return;

                const isLiked = html.includes('i_svg i_new-ui-checkmark-circle-outlined');
                likedVideoCache.set(videoUrl, isLiked);

                // Hide the video immediately if it's liked
                if (isLiked && settings.filterLikedVideos) {
                    videoItem.style.display = 'none';
                    videoItem.classList.add('gm-hidden-liked');
                    console.log(`Hidden liked video: ${videoUrl}`);
                }
            })
            .catch(error => {
                console.error(`Error fetching ${videoUrl}:`, error);
                likedVideoCache.delete(videoUrl);
            });
    }

    // Filter liked videos from the page (synchronous for cached, async fetches for uncached)
    function filterLikedVideos() {
        if (!settings.filterLikedVideos) return;

        const videoItems = document.querySelectorAll('.video-item, .js-video-item');
        let hiddenCount = 0;

        videoItems.forEach(item => {
            // Skip if already processed
            if (item.classList.contains('gm-checked-liked')) return;

            const linkElement = item.querySelector('a[href*="/video/"]');
            if (!linkElement) return;

            const videoUrl = linkElement.href;

            // Check cache first (synchronous)
            if (likedVideoCache.has(videoUrl)) {
                const isLiked = likedVideoCache.get(videoUrl);

                // null means fetch is pending, true/false means we have a result
                if (isLiked === true) {
                    item.style.display = 'none';
                    item.classList.add('gm-hidden-liked');
                    hiddenCount++;
                }

                if (isLiked !== null) {
                    item.classList.add('gm-checked-liked');
                }
            } else {
                // Not cached - start background fetch
                fetchVideoLikedStatus(item);
            }
        });

        if (hiddenCount > 0) {
            console.log(`Hidden ${hiddenCount} liked video(s) from cache`);
        }
    }

    // Show all hidden liked videos
    function showLikedVideos() {
        const hiddenItems = document.querySelectorAll('.gm-hidden-liked');
        hiddenItems.forEach(item => {
            item.style.display = '';
            item.classList.remove('gm-hidden-liked');
            item.classList.remove('gm-checked-liked');
        });
    }

    // Simple settings panel placeholder toggled by the settings button
    const toggleSettingsPanel = () => {
        let panel = document.getElementById('gm-settings-panel');
        if (panel) { panel.remove(); return; }

        panel = document.createElement('div');
        panel.id = 'gm-settings-panel';
        Object.assign(panel.style, {
            position: 'absolute',
            top: '44px',
            right: '10px',
            width: '260px',
            background: '#1a1a1a',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#fff',
            padding: '12px',
            borderRadius: '8px',
            zIndex: '10000',
            boxShadow: '0 6px 24px rgba(0,0,0,0.4)',
            fontSize: '13px'
        });

        // Build settings content
        const content = document.createElement('div');
        content.style.marginTop = '8px';

        // Filter Liked Videos checkbox
        const likedLabel = document.createElement('label');
        likedLabel.style.display = 'flex';
        likedLabel.style.alignItems = 'center';
        likedLabel.style.cursor = 'pointer';
        likedLabel.style.padding = '8px 0';

        const likedCheckbox = document.createElement('input');
        likedCheckbox.type = 'checkbox';
        likedCheckbox.checked = settings.filterLikedVideos;
        likedCheckbox.style.marginRight = '8px';
        likedCheckbox.style.cursor = 'pointer';

        likedCheckbox.addEventListener('change', (e) => {
            settings.filterLikedVideos = e.target.checked;
            saveSettings(settings);

            if (settings.filterLikedVideos) {
                filterLikedVideos();
            } else {
                showLikedVideos();
            }
        });

        const likedText = document.createElement('span');
        likedText.textContent = 'Hide Liked Videos';
        likedText.style.userSelect = 'none';

        likedLabel.appendChild(likedCheckbox);
        likedLabel.appendChild(likedText);
        content.appendChild(likedLabel);

        // Add description
        const desc = document.createElement('div');
        desc.textContent = 'Automatically hide videos you have already liked';
        desc.style.fontSize = '11px';
        desc.style.color = '#999';
        desc.style.marginTop = '4px';
        desc.style.marginBottom = '8px';
        content.appendChild(desc);

        panel.innerHTML = '<strong style="display:block;margin-bottom:8px">Script Settings</strong>';
        panel.appendChild(content);

        const close = document.createElement('button');
        close.textContent = '✕';
        Object.assign(close.style, { position: 'absolute', top: '6px', right: '6px', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '18px' });
        close.addEventListener('click', () => panel.remove());
        panel.appendChild(close);

        const container = document.querySelector('.top.main_content_container');
        if (container) container.appendChild(panel);
        else document.body.appendChild(panel);
    };

    VM.observe(document.body, () => {
        document.querySelectorAll('.dl').forEach(attachDlHandler);
        addSettingsButton();

        // Apply liked videos filter if enabled
        if (settings.filterLikedVideos) {
            filterLikedVideos();
        }

        // keep observing
        return false;
    });

    // Initial attempt to add the settings button if the node is already present
    addSettingsButton();

    // Apply filter on initial page load
    if (settings.filterLikedVideos) {
        // Wait a bit for the page to fully load
        setTimeout(filterLikedVideos, 500);
    }
})();