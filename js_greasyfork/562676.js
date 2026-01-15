// ==UserScript==
// @name         CandidGirls Media Downloader
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Batch download images/gifs, scan for video links and viewed post history
// @author       You
// @match        https://forum.candidgirls.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562676/CandidGirls%20Media%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/562676/CandidGirls%20Media%20Downloader.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Configuration
    const CONFIG = {
        mainPanelId: 'cg-main-panel',
        mainButtonId: 'cg-main-button',
        debugPanelId: 'cg-debug-panel',
        mainButtonText: '🛠️ CG Tools',
        debugMode: false
    };

    // LocalStorage keys
    const VISITED_POSTS_KEY = 'cg_visited_posts';

    // State management
    let selectedImages = new Set();
    let currentPostImages = new Map();
    let detectedVideoLinks = [];
    let debugLogs = [];
    let visitedPosts = new Set();

    // Debug & Notification System
    function log(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = { timestamp, message, type };
        debugLogs.push(logEntry);

        // Keep only last 100 logs
        if (debugLogs.length > 100) {
            debugLogs.shift();
        }

        if (CONFIG.debugMode) {
            console.log(`[CG Tools ${type.toUpperCase()}] ${message}`);
            updateDebugPanel();
        }
    }

    function showNotification(message, type = 'info') {
        const notification = createElement('div', `cg-notification cg-notification-${type}`, message, {
            style: `
                position: fixed;
                top: 80px;
                right: 20px;
                background: ${type === 'error' ? '#dc3545' : type === 'success' ? '#28a745' : '#007bff'};
                color: white;
                padding: 12px 20px;
                border-radius: 6px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                z-index: 10001;
                font-family: Arial, sans-serif;
                font-size: 14px;
                max-width: 300px;
                animation: slideIn 0.3s ease;
            `
        });

        document.body.appendChild(notification);
        log(message, type);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Utility functions
    function createElement(tag, className, textContent, attributes = {}) {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (textContent) element.textContent = textContent;
        Object.entries(attributes).forEach(([key, value]) => {
            element.setAttribute(key, value);
        });
        return element;
    }

    function getPostId(element) {
        const postElement = element.closest('[data-post-id]');
        return postElement ? postElement.getAttribute('data-post-id') : null;
    }

    function getPostTitle() {
        const topicTitle = document.querySelector('.fancy-title') ||
            document.querySelector('h1') ||
            document.querySelector('.topic-title');

        if (topicTitle) {
            return topicTitle.textContent.trim();
        }

        return document.title.replace(' - CandidGirls', '').trim();
    }

    function sanitizeFileName(fileName) {
        return fileName
            .replace(/[<>:"/\\|?*]/g, '_')
            .replace(/\s+/g, '_')
            .substring(0, 100);
    }

    // Visited Posts Management
    function loadVisitedPosts() {
        try {
            const stored = localStorage.getItem(VISITED_POSTS_KEY);
            if (stored) {
                visitedPosts = new Set(JSON.parse(stored));
                log(`Loaded ${visitedPosts.size} visited posts from storage`);
            }
        } catch (error) {
            log(`Error loading visited posts: ${error.message}`, 'error');
            visitedPosts = new Set();
        }
    }

    function saveVisitedPosts() {
        try {
            localStorage.setItem(VISITED_POSTS_KEY, JSON.stringify([...visitedPosts]));
            log(`Saved ${visitedPosts.size} visited posts to storage`);
        } catch (error) {
            log(`Error saving visited posts: ${error.message}`, 'error');
        }
    }

    function markPostAsVisited(postId) {
        if (!postId) return;
        visitedPosts.add(postId);
        saveVisitedPosts();
        log(`Marked post ${postId} as visited`);
    }

    function isPostVisited(postId) {
        return visitedPosts.has(postId);
    }

    function clearVisitedPosts() {
        visitedPosts.clear();
        localStorage.removeItem(VISITED_POSTS_KEY);
        log('Cleared all visited posts');
        showNotification('Visited posts history cleared', 'success');
    }

    function getCurrentPostIdFromUrl() {
        // Example URL: https://forum.candidgirls.io/t/crazy-latina-milf-in-a-thong/706722
        const match = window.location.pathname.match(/\/t\/[^\/]+\/(\d+)/);
        return match ? match[1] : null;
    }

    function getPostIdFromLink(element) {
        // Try to extract post ID from topic link
        const href = element.getAttribute('href') || element.href;
        if (href) {
            const match = href.match(/\/t\/[^\/]+\/(\d+)/);
            return match ? match[1] : null;
        }
        return null;
    }

    function applyVisitedMarkers() {
        // Find all topic links on the page (category view)
        const topicLinks = document.querySelectorAll('a.title, a.raw-topic-link, .topic-list-item a.title');

        if (topicLinks.length === 0) {
            log('No topic links found on this page');
            return;
        }

        let markedCount = 0;
        topicLinks.forEach(link => {
            const postId = getPostIdFromLink(link);
            if (postId && isPostVisited(postId)) {
                // Check if already marked
                if (link.querySelector('.cg-visited-marker')) return;

                // Add visual marker
                const marker = createElement('span', 'cg-visited-marker', '✓', {
                    style: `
                        display: inline-block;
                        margin-left: 8px;
                        padding: 2px 8px;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        border-radius: 12px;
                        font-size: 11px;
                        font-weight: bold;
                        vertical-align: middle;
                    `,
                    title: 'You have visited this post'
                });

                link.appendChild(marker);

                // Also dim the title slightly
                link.style.opacity = '0.6';
                markedCount++;
            }
        });

        if (markedCount > 0) {
            log(`Marked ${markedCount} visited posts on this page`);
        }
    }

    // Video detection functions
    function detectVideoLinks() {
        log('Starting video link detection...');
        const videoLinks = [];
        const videoHosts = [
            'gofile.io', 'gofile.com', 'mega.nz', 'mega.co.nz', 'dropbox.com', 'google.com/drive',
            'onedrive.live.com', 'mediafire.com', 'zippyshare.com', 'uploaded.net', 'rapidgator.net',
            'nitroflare.com', 'turbobit.net', 'depositfiles.com', 'filefactory.com', 'userscloud.com',
            'sendspace.com', '4shared.com', 'box.com', 'pcloud.com', 'terabox.com',
            'yandex.ru', 'disk.yandex.ru', 'mexa.sh', 'anonfiles.com', 'bayfiles.com', 'catbox.moe',
            'litterbox.moe', 'filebin.net', 'tmpfiles.org', '0x0.st', 'transfer.sh', 'wetransfer.com',
            'sendgb.com', 'uploadfiles.io', 'file.io', 'uguu.se', 'pomf.cat', 'mixtape.moe'
        ];

        const postContent = document.querySelector('.cooked') || document.querySelector('.post-content') || document.querySelector('.topic-body');
        if (!postContent) {
            log('No post content found', 'warning');
            return videoLinks;
        }

        const textContent = postContent.textContent || '';

        function getContext(text, match, contextLength = 100) {
            const matchIndex = text.indexOf(match);
            if (matchIndex === -1) return match;

            const start = Math.max(0, matchIndex - contextLength);
            const end = Math.min(text.length, matchIndex + match.length + contextLength);
            const context = text.substring(start, end);

            return context.replace(/\s+/g, ' ').trim();
        }

        // Method 1: Video file extensions
        const videoExtensions = /\.(mp4|avi|mkv|mov|wmv|flv|webm|m4v|3gp|mpg|mpeg|m2v|asf|rm|rmvb|vob|ogv|mts|m2ts|ts)(\?|$|"|'|\s)/gi;
        const extensionMatches = textContent.match(videoExtensions);
        if (extensionMatches) {
            extensionMatches.forEach(match => {
                videoLinks.push({
                    type: 'video_extension',
                    text: match.trim(),
                    context: getContext(textContent, match),
                    confidence: 'high',
                    reason: 'Contains video file extension'
                });
            });
        }

        // Method 2: Spaced URLs
        const spacedUrlPattern = /https?:\/\/\s*[a-zA-Z0-9.-]+\s*\.\s*[a-zA-Z]{2,}\s*\/[^\s]*/gi;
        const spacedMatches = textContent.match(spacedUrlPattern);
        if (spacedMatches) {
            spacedMatches.forEach(match => {
                const cleanedUrl = match.replace(/\s+/g, '');
                const isVideoHost = videoHosts.some(host => cleanedUrl.includes(host));
                if (isVideoHost) {
                    videoLinks.push({
                        type: 'spaced_url',
                        text: match.trim(),
                        cleanedUrl: cleanedUrl,
                        context: getContext(textContent, match),
                        confidence: 'high',
                        reason: 'Spaced URL from known video host'
                    });
                }
            });
        }

        // Method 3: Domain patterns
        const domainPattern = /([a-zA-Z0-9.-]+\s*\.\s*[a-zA-Z]{2,}\s*\/[^\s]*)/gi;
        const domainMatches = textContent.match(domainPattern);
        if (domainMatches) {
            domainMatches.forEach(match => {
                if (match.includes('go') && match.includes('file')) {
                    return;
                }

                const cleanedUrl = 'https://' + match.replace(/\s+/g, '');
                const isVideoHost = videoHosts.some(host => cleanedUrl.includes(host));
                if (isVideoHost) {
                    videoLinks.push({
                        type: 'domain_url',
                        text: match.trim(),
                        cleanedUrl: cleanedUrl,
                        context: getContext(textContent, match),
                        confidence: 'high',
                        reason: 'Domain pattern from known video host'
                    });
                }
            });
        }

        // Method 4: Gofile specific patterns
        const goFilePattern = /(go\s+file\s*\.\s*io\s*\/[^\s]*)/gi;
        const goFileMatches = textContent.match(goFilePattern);
        if (goFileMatches) {
            goFileMatches.forEach(match => {
                const cleanedUrl = 'https://' + match.replace(/\s+/g, '');
                videoLinks.push({
                    type: 'gofile_spaced',
                    text: match.trim(),
                    cleanedUrl: cleanedUrl,
                    context: getContext(textContent, match),
                    confidence: 'high',
                    reason: 'Gofile spaced pattern detected'
                });
            });
        }

        // Remove duplicates
        const uniqueLinks = [];
        const seenUrls = new Set();

        const priorityOrder = {
            'gofile_spaced': 1,
            'spaced_domain': 2,
            'domain_url': 3,
            'spaced_url': 4,
            'video_extension': 5
        };

        videoLinks.sort((a, b) => {
            const aPriority = priorityOrder[a.type] || 999;
            const bPriority = priorityOrder[b.type] || 999;
            return aPriority - bPriority;
        });

        videoLinks.forEach(link => {
            const key = link.cleanedUrl || link.text;
            if (!seenUrls.has(key)) {
                seenUrls.add(key);
                uniqueLinks.push(link);
            }
        });

        log(`Detected ${uniqueLinks.length} video links`, 'success');
        return uniqueLinks;
    }

    // Image detection functions
    function getCurrentPostImages() {
        log('Starting image detection...');
        const images = new Map();
        const postTitle = getPostTitle();
        const seenUrls = new Set();
        let index = 0;

        const resolveUrl = (url) => {
            if (!url) return null;
            if (url.startsWith('data:')) return url;
            try {
                if (url.startsWith('//')) {
                    url = window.location.protocol + url;
                }
                const resolved = new URL(url, window.location.href).href;
                return resolved;
            } catch (e) {
                log(`Failed to resolve URL: ${url}`, 'error');
                return null;
            }
        };

        const isImageUrl = (url) => {
            if (!url) return false;
            if (/\.(jpg|jpeg|png|webp|gif|bmp|svg|ico|tiff)(\?|$)/i.test(url)) return true;
            if (/\/uploads\/default\/original\//i.test(url)) return true;
            return false;
        };

        const addImage = (url, downloadUrl, title, element) => {
            let absoluteUrl = resolveUrl(url);
            let absoluteDownloadUrl = resolveUrl(downloadUrl);

            if (!absoluteUrl) return;

            if (!isImageUrl(absoluteUrl)) {
                log(`Rejected invalid URL: ${absoluteUrl}`, 'warning');
                return;
            }

            if (absoluteDownloadUrl && !isImageUrl(absoluteDownloadUrl)) {
                absoluteDownloadUrl = absoluteUrl;
            }

            if (!absoluteDownloadUrl) absoluteDownloadUrl = absoluteUrl;

            if (seenUrls.has(absoluteUrl)) return;

            if (absoluteUrl.includes('avatar') || absoluteUrl.includes('/emoji/') || absoluteUrl.includes('favicon')) return;

            seenUrls.add(absoluteUrl);

            const postId = getPostId(element);
            const wrapper = element.closest('.lightbox-wrapper') || element.parentElement;

            images.set(index++, {
                originalUrl: absoluteUrl,
                downloadUrl: absoluteDownloadUrl,
                title: title || `Image ${index}`,
                postTitle,
                postId,
                wrapper: wrapper || element,
                link: element.tagName === 'A' ? element : element.closest('a'),
                img: element.tagName === 'IMG' ? element : element.querySelector('img')
            });

            log(`Added image: ${title || absoluteUrl}`, 'info');
        };

        // 1. Process Lightbox Wrappers
        const lightboxWrappers = document.querySelectorAll('.lightbox-wrapper');
        log(`Found ${lightboxWrappers.length} lightbox wrappers`);
        lightboxWrappers.forEach((wrapper) => {
            const link = wrapper.querySelector('a.lightbox');
            if (link) {
                const href = link.getAttribute('href');
                const downloadHref = link.getAttribute('data-download-href');
                const title = link.getAttribute('title');
                addImage(href, downloadHref, title, wrapper);
            }
        });

        // 2. Process all images in post content
        const contentImages = document.querySelectorAll('.cooked img, .post-content img');
        log(`Found ${contentImages.length} content images`);
        contentImages.forEach(img => {
            if (img.closest('.lightbox-wrapper')) return;
            if (img.classList.contains('emoji') || img.classList.contains('avatar') || img.classList.contains('site-icon')) return;

            const candidates = [];

            const parentLink = img.closest('a');
            if (parentLink) candidates.push(parentLink.getAttribute('href'));

            candidates.push(img.getAttribute('data-download-href'));
            candidates.push(img.getAttribute('data-orig-src'));
            candidates.push(img.getAttribute('src'));

            let candidateUrl = null;
            let downloadUrl = null;

            for (const url of candidates) {
                if (isImageUrl(url)) {
                    candidateUrl = url;
                    if (parentLink && url === parentLink.getAttribute('href')) {
                        downloadUrl = url;
                    }
                    break;
                }
            }

            if (candidateUrl) {
                addImage(candidateUrl, downloadUrl, img.getAttribute('alt') || img.getAttribute('title'), img);
            }
        });

        log(`Total images detected: ${images.size}`, 'success');
        return images;
    }

    // UI Creation Functions
    function createMainButton() {
        const button = createElement('button', 'cg-main-btn', CONFIG.mainButtonText, {
            id: CONFIG.mainButtonId,
            style: `
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                padding: 12px 20px;
                border-radius: 8px;
                cursor: pointer;
                font-size: 14px;
                font-weight: bold;
                box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
                z-index: 9999;
                transition: all 0.3s ease;
            `
        });

        button.addEventListener('click', toggleMainPanel);

        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px)';
            button.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
        });

        return button;
    }

    function createMainPanel() {
        const panel = createElement('div', 'cg-main-panel', '', {
            id: CONFIG.mainPanelId,
            style: `
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                border: 2px solid #667eea;
                border-radius: 12px;
                padding: 20px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.2);
                z-index: 10000;
                font-family: Arial, sans-serif;
                min-width: 400px;
                max-width: 500px;
                max-height: 80vh;
                overflow-y: auto;
                display: none;
            `
        });

        // Header
        const header = createElement('div', '', '', {
            style: 'margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center;'
        });

        const title = createElement('h3', '', '🛠️ CandidGirls Tools', {
            style: 'margin: 0; color: #667eea; font-size: 18px;'
        });

        const closeBtn = createElement('button', '', '×', {
            style: `
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #666;
                padding: 0;
                width: 30px;
                height: 30px;
            `
        });
        closeBtn.addEventListener('click', toggleMainPanel);

        header.appendChild(title);
        header.appendChild(closeBtn);

        // Debug Mode Toggle
        const debugToggle = createElement('div', '', '', {
            style: 'margin-bottom: 15px; padding: 10px; background: #f8f9fa; border-radius: 6px;'
        });

        const debugLabel = createElement('label', '', '', {
            style: 'display: flex; align-items: center; cursor: pointer;'
        });

        const debugCheckbox = createElement('input', '', '', {
            type: 'checkbox',
            style: 'margin-right: 10px; cursor: pointer;'
        });
        debugCheckbox.checked = CONFIG.debugMode;
        debugCheckbox.addEventListener('change', (e) => {
            CONFIG.debugMode = e.target.checked;
            log(`Debug mode ${CONFIG.debugMode ? 'enabled' : 'disabled'}`, 'info');
            updateDebugButtonVisibility();
            if (CONFIG.debugMode) {
                showNotification('Debug mode enabled', 'success');
            } else {
                showNotification('Debug mode disabled', 'info');
            }
        });

        const debugText = createElement('span', '', '🐛 Enable Debug Mode');
        debugLabel.appendChild(debugCheckbox);
        debugLabel.appendChild(debugText);
        debugToggle.appendChild(debugLabel);

        // Visited Posts Section
        const visitedSection = createElement('div', '', '', {
            style: 'margin-bottom: 15px; padding: 10px; background: #f8f9fa; border-radius: 6px;'
        });

        const visitedHeader = createElement('div', '', '', {
            style: 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;'
        });

        const visitedLabel = createElement('span', '', '📖 Visited Posts', {
            style: 'font-weight: bold; font-size: 14px; color: #333;'
        });

        const visitedCount = createElement('span', '', `${visitedPosts.size} posts`, {
            id: 'cg-visited-count',
            style: 'font-size: 12px; color: #666;'
        });

        const clearHistoryBtn = createElement('button', '', '🗑️ Clear History', {
            style: `
                padding: 6px 12px;
                border: 1px solid #dc3545;
                background: white;
                color: #dc3545;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                margin-top: 8px;
                transition: all 0.2s ease;
            `
        });

        clearHistoryBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear all visited posts history?')) {
                clearVisitedPosts();
                updateVisitedCount();
                // Refresh markers on current page
                setTimeout(() => {
                    const markers = document.querySelectorAll('.cg-visited-marker');
                    markers.forEach(m => m.remove());
                    const dimmedLinks = document.querySelectorAll('a.title[style*="opacity"]');
                    dimmedLinks.forEach(l => l.style.opacity = '1');
                }, 100);
            }
        });

        clearHistoryBtn.addEventListener('mouseenter', () => {
            clearHistoryBtn.style.background = '#dc3545';
            clearHistoryBtn.style.color = 'white';
        });

        clearHistoryBtn.addEventListener('mouseleave', () => {
            clearHistoryBtn.style.background = 'white';
            clearHistoryBtn.style.color = '#dc3545';
        });

        visitedHeader.appendChild(visitedLabel);
        visitedHeader.appendChild(visitedCount);
        visitedSection.appendChild(visitedHeader);
        visitedSection.appendChild(clearHistoryBtn);

        // Tabs
        const tabContainer = createElement('div', '', '', {
            style: 'display: flex; gap: 10px; margin-bottom: 15px; border-bottom: 2px solid #e9ecef;'
        });

        const imageTab = createTab('📥 Images', true);
        const videoTab = createTab('🎥 Videos', false);

        tabContainer.appendChild(imageTab);
        tabContainer.appendChild(videoTab);

        // Content Areas
        const imageContent = createImageContent();
        const videoContent = createVideoContent();
        videoContent.style.display = 'none';

        // Tab switching
        imageTab.addEventListener('click', () => {
            imageTab.classList.add('active');
            videoTab.classList.remove('active');
            imageContent.style.display = 'block';
            videoContent.style.display = 'none';
        });

        videoTab.addEventListener('click', () => {
            videoTab.classList.add('active');
            imageTab.classList.remove('active');
            videoContent.style.display = 'block';
            imageContent.style.display = 'none';
        });

        // Assemble panel
        panel.appendChild(header);
        panel.appendChild(debugToggle);
        panel.appendChild(visitedSection);
        panel.appendChild(tabContainer);
        panel.appendChild(imageContent);
        panel.appendChild(videoContent);

        return panel;
    }

    function createTab(text, active = false) {
        const tab = createElement('button', active ? 'active' : '', text, {
            style: `
                flex: 1;
                padding: 10px;
                border: none;
                background: ${active ? '#667eea' : 'transparent'};
                color: ${active ? 'white' : '#666'};
                cursor: pointer;
                font-size: 14px;
                font-weight: bold;
                border-radius: 6px 6px 0 0;
                transition: all 0.2s ease;
            `
        });

        tab.addEventListener('mouseenter', function () {
            if (!this.classList.contains('active')) {
                this.style.background = '#f8f9fa';
            }
        });

        tab.addEventListener('mouseleave', function () {
            if (!this.classList.contains('active')) {
                this.style.background = 'transparent';
            }
        });

        // Update tab style when class changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const isActive = tab.classList.contains('active');
                    tab.style.background = isActive ? '#667eea' : 'transparent';
                    tab.style.color = isActive ? 'white' : '#666';
                }
            });
        });
        observer.observe(tab, { attributes: true });

        return tab;
    }

    function createImageContent() {
        const content = createElement('div', 'cg-image-content', '', {
            id: 'cg-image-content'
        });

        const stats = createElement('div', '', '', {
            id: 'cg-image-stats',
            style: 'margin-bottom: 10px; font-size: 14px; color: #666;'
        });

        const controls = createElement('div', '', '', {
            style: 'display: flex; gap: 10px; margin-bottom: 15px;'
        });

        const scanBtn = createElement('button', '', '🔍 Scan Images', {
            style: `
                flex: 1;
                padding: 10px 16px;
                border: none;
                background: #007bff;
                color: white;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                font-weight: bold;
                transition: all 0.2s ease;
            `
        });
        scanBtn.addEventListener('click', scanImages);
        scanBtn.addEventListener('mouseenter', () => scanBtn.style.background = '#0056b3');
        scanBtn.addEventListener('mouseleave', () => scanBtn.style.background = '#007bff');

        const selectAllBtn = createElement('button', '', 'Select All', {
            style: `
                padding: 10px 16px;
                border: 1px solid #007bff;
                background: white;
                color: #007bff;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
            `
        });
        selectAllBtn.addEventListener('click', toggleSelectAll);

        const downloadBtn = createElement('button', '', '⬇️ Download', {
            style: `
                padding: 10px 16px;
                border: none;
                background: #28a745;
                color: white;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                font-weight: bold;
            `
        });
        downloadBtn.addEventListener('click', downloadSelectedImages);

        const imageList = createElement('div', 'cg-image-list', '', {
            id: 'cg-image-list',
            style: 'max-height: 400px; overflow-y: auto;'
        });

        controls.appendChild(scanBtn);
        controls.appendChild(selectAllBtn);
        controls.appendChild(downloadBtn);

        content.appendChild(stats);
        content.appendChild(controls);
        content.appendChild(imageList);

        return content;
    }

    function createVideoContent() {
        const content = createElement('div', 'cg-video-content', '', {
            id: 'cg-video-content'
        });

        const stats = createElement('div', '', '', {
            id: 'cg-video-stats',
            style: 'margin-bottom: 10px; font-size: 14px; color: #666;'
        });

        const controls = createElement('div', '', '', {
            style: 'display: flex; gap: 10px; margin-bottom: 15px;'
        });

        const scanBtn = createElement('button', '', '🔍 Scan Videos', {
            style: `
                flex: 1;
                padding: 10px 16px;
                border: none;
                background: #28a745;
                color: white;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                font-weight: bold;
            `
        });
        scanBtn.addEventListener('click', scanVideos);

        const copyAllBtn = createElement('button', '', '📋 Copy All', {
            style: `
                padding: 10px 16px;
                border: 1px solid #28a745;
                background: white;
                color: #28a745;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
            `
        });
        copyAllBtn.addEventListener('click', copyAllVideoLinks);

        const videoList = createElement('div', 'cg-video-list', '', {
            id: 'cg-video-list',
            style: 'max-height: 400px; overflow-y: auto;'
        });

        controls.appendChild(scanBtn);
        controls.appendChild(copyAllBtn);

        content.appendChild(stats);
        content.appendChild(controls);
        content.appendChild(videoList);

        return content;
    }

    function createDebugPanel() {
        const panel = createElement('div', 'cg-debug-panel', '', {
            id: CONFIG.debugPanelId,
            style: `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: #1e1e1e;
                color: #d4d4d4;
                border: 2px solid #667eea;
                border-radius: 12px;
                padding: 15px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.4);
                z-index: 10000;
                font-family: 'Courier New', monospace;
                width: 500px;
                max-height: 400px;
                display: none;
            `
        });

        const header = createElement('div', '', '', {
            style: 'margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #444; padding-bottom: 10px;'
        });

        const title = createElement('h4', '', '🐛 Debug Console', {
            style: 'margin: 0; color: #667eea; font-size: 14px;'
        });

        const controls = createElement('div', '', '', {
            style: 'display: flex; gap: 10px;'
        });

        const clearBtn = createElement('button', '', 'Clear', {
            style: `
                background: #dc3545;
                color: white;
                border: none;
                padding: 4px 10px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 11px;
            `
        });
        clearBtn.addEventListener('click', () => {
            debugLogs = [];
            updateDebugPanel();
        });

        const closeBtn = createElement('button', '', '×', {
            style: `
                background: none;
                border: none;
                color: #999;
                font-size: 20px;
                cursor: pointer;
                padding: 0;
                width: 20px;
                height: 20px;
            `
        });
        closeBtn.addEventListener('click', toggleDebugPanel);

        controls.appendChild(clearBtn);
        controls.appendChild(closeBtn);
        header.appendChild(title);
        header.appendChild(controls);

        const logContainer = createElement('div', 'cg-debug-logs', '', {
            id: 'cg-debug-logs',
            style: `
                max-height: 320px;
                overflow-y: auto;
                font-size: 12px;
                line-height: 1.5;
            `
        });

        panel.appendChild(header);
        panel.appendChild(logContainer);

        return panel;
    }

    function updateDebugPanel() {
        const logContainer = document.getElementById('cg-debug-logs');
        if (!logContainer) return;

        logContainer.innerHTML = '';

        debugLogs.forEach(log => {
            const logEntry = createElement('div', '', '', {
                style: `
                    padding: 4px;
                    margin-bottom: 2px;
                    border-left: 3px solid ${log.type === 'error' ? '#dc3545' : log.type === 'warning' ? '#ffc107' : log.type === 'success' ? '#28a745' : '#007bff'};
                    padding-left: 8px;
                `
            });

            const timestamp = createElement('span', '', `[${log.timestamp}]`, {
                style: 'color: #858585; margin-right: 8px;'
            });

            const type = createElement('span', '', `${log.type.toUpperCase()}:`, {
                style: `color: ${log.type === 'error' ? '#f48771' : log.type === 'warning' ? '#dcdcaa' : log.type === 'success' ? '#4ec9b0' : '#569cd6'}; margin-right: 8px; font-weight: bold;`
            });

            const message = createElement('span', '', log.message, {
                style: 'color: #d4d4d4;'
            });

            logEntry.appendChild(timestamp);
            logEntry.appendChild(type);
            logEntry.appendChild(message);
            logContainer.appendChild(logEntry);
        });

        // Auto-scroll to bottom
        logContainer.scrollTop = logContainer.scrollHeight;
    }

    function updateDebugButtonVisibility() {
        const debugPanel = document.getElementById(CONFIG.debugPanelId);
        if (debugPanel) {
            if (CONFIG.debugMode) {
                debugPanel.style.display = 'block';
            } else {
                debugPanel.style.display = 'none';
            }
        }
    }

    // Panel Control Functions
    function toggleMainPanel() {
        const panel = document.getElementById(CONFIG.mainPanelId);
        const button = document.getElementById(CONFIG.mainButtonId);

        if (!panel || !button) return;

        if (panel.style.display === 'none') {
            panel.style.display = 'block';
            button.style.display = 'none';
            log('Main panel opened');
        } else {
            panel.style.display = 'none';
            button.style.display = 'block';
            log('Main panel closed');
        }
    }

    function toggleDebugPanel() {
        const panel = document.getElementById(CONFIG.debugPanelId);
        if (!panel) return;

        if (panel.style.display === 'none') {
            panel.style.display = 'block';
            log('Debug panel opened');
        } else {
            panel.style.display = 'none';
            log('Debug panel closed');
        }
    }

    function updateVisitedCount() {
        const countElement = document.getElementById('cg-visited-count');
        if (countElement) {
            countElement.textContent = `${visitedPosts.size} posts`;
        }
    }

    // Image Functions
    function scanImages() {
        try {
            log('Scanning for images...');
            currentPostImages = getCurrentPostImages();
            selectedImages.clear();

            if (currentPostImages.size === 0) {
                showNotification('No images found in this post', 'warning');
                return;
            }

            updateImageList();
            updateImageStats();
            showNotification(`Found ${currentPostImages.size} images`, 'success');
        } catch (error) {
            log(`Error scanning images: ${error.message}`, 'error');
            showNotification('Error scanning images', 'error');
        }
    }

    function toggleSelectAll() {
        const allImages = Array.from(currentPostImages.keys());
        const shouldSelectAll = selectedImages.size < currentPostImages.size;

        if (shouldSelectAll) {
            allImages.forEach(index => selectedImages.add(index));
            log(`Selected all ${allImages.length} images`);
        } else {
            selectedImages.clear();
            log('Deselected all images');
        }

        updateImageList();
        updateImageStats();
    }

    function updateImageList() {
        const imageList = document.getElementById('cg-image-list');
        if (!imageList) return;

        imageList.innerHTML = '';

        if (currentPostImages.size === 0) {
            const noResults = createElement('div', '', 'Click "Scan Images" to detect images in this post.', {
                style: 'text-align: center; color: #999; padding: 40px 20px; font-style: italic;'
            });
            imageList.appendChild(noResults);
            return;
        }

        currentPostImages.forEach((imageData, index) => {
            const isSelected = selectedImages.has(index);

            const item = createElement('div', 'cg-image-item', '', {
                style: `
                    display: flex;
                    align-items: center;
                    padding: 10px;
                    border: 2px solid ${isSelected ? '#667eea' : '#ddd'};
                    border-radius: 8px;
                    margin-bottom: 8px;
                    cursor: pointer;
                    transition: all 0.2s;
                    background-color: ${isSelected ? '#f0f3ff' : 'white'};
                `
            });

            const checkbox = createElement('input', '', '', {
                type: 'checkbox',
                style: 'margin-right: 10px; cursor: pointer; width: 18px; height: 18px;'
            });
            checkbox.checked = isSelected;

            checkbox.addEventListener('change', (e) => {
                e.stopPropagation();
                if (checkbox.checked) {
                    selectedImages.add(index);
                } else {
                    selectedImages.delete(index);
                }
                updateImageList();
                updateImageStats();
            });

            const imageInfo = createElement('div', '', '', {
                style: 'flex: 1;'
            });

            const title = createElement('div', '', imageData.title, {
                style: `font-weight: bold; margin-bottom: 4px; color: ${isSelected ? '#667eea' : '#333'};`
            });

            const url = createElement('div', '', imageData.originalUrl, {
                style: 'font-size: 11px; color: #666; word-break: break-all; font-family: monospace;'
            });

            item.addEventListener('click', (e) => {
                if (e.target !== checkbox) {
                    checkbox.checked = !checkbox.checked;
                    checkbox.dispatchEvent(new Event('change'));
                }
            });

            imageInfo.appendChild(title);
            imageInfo.appendChild(url);
            item.appendChild(checkbox);
            item.appendChild(imageInfo);
            imageList.appendChild(item);
        });
    }

    function updateImageStats() {
        const stats = document.getElementById('cg-image-stats');
        if (stats) {
            stats.textContent = `${selectedImages.size} of ${currentPostImages.size} images selected`;
        }
    }

    async function downloadSelectedImages() {
        if (selectedImages.size === 0) {
            showNotification('Please select at least one image', 'warning');
            return;
        }

        try {
            log(`Starting download of ${selectedImages.size} images...`);
            let downloadCount = 0;

            for (const index of selectedImages) {
                const imageData = currentPostImages.get(index);
                if (imageData) {
                    const postTitle = sanitizeFileName(imageData.postTitle || 'CandidGirls_Image');
                    const imageTitle = sanitizeFileName(imageData.title || `image_${index + 1}`);
                    const fileName = `${postTitle}_${imageTitle}.jpg`;

                    const link = document.createElement('a');
                    link.href = imageData.downloadUrl;
                    link.download = fileName;
                    link.target = '_blank';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);

                    downloadCount++;
                    log(`Downloaded: ${fileName}`);

                    await new Promise(resolve => setTimeout(resolve, 500));
                }
            }

            showNotification(`Successfully downloaded ${downloadCount} images!`, 'success');
            log(`Download complete: ${downloadCount} images`, 'success');
        } catch (error) {
            log(`Error downloading images: ${error.message}`, 'error');
            showNotification('Error downloading images', 'error');
        }
    }

    // Video Functions
    function scanVideos() {
        try {
            log('Scanning for video links...');
            detectedVideoLinks = detectVideoLinks();
            updateVideoList();
            updateVideoStats();

            if (detectedVideoLinks.length === 0) {
                showNotification('No video links found', 'warning');
            } else {
                showNotification(`Found ${detectedVideoLinks.length} video links`, 'success');
            }
        } catch (error) {
            log(`Error scanning videos: ${error.message}`, 'error');
            showNotification('Error scanning videos', 'error');
        }
    }

    function updateVideoList() {
        const videoList = document.getElementById('cg-video-list');
        if (!videoList) return;

        videoList.innerHTML = '';

        if (detectedVideoLinks.length === 0) {
            const noResults = createElement('div', '', 'Click "Scan Videos" to detect video links in this post.', {
                style: 'text-align: center; color: #999; padding: 40px 20px; font-style: italic;'
            });
            videoList.appendChild(noResults);
            return;
        }

        detectedVideoLinks.forEach((link, index) => {
            const item = createElement('div', 'cg-video-item', '', {
                style: `
                    padding: 12px;
                    border: 2px solid #ddd;
                    border-radius: 8px;
                    margin-bottom: 10px;
                    background: #f8f9fa;
                `
            });

            const header = createElement('div', '', '', {
                style: 'display: flex; gap: 8px; margin-bottom: 8px; flex-wrap: wrap;'
            });

            const confidenceBadge = createElement('span', '', link.confidence.toUpperCase(), {
                style: `
                    display: inline-block;
                    padding: 3px 10px;
                    border-radius: 12px;
                    font-size: 11px;
                    font-weight: bold;
                    background: ${link.confidence === 'high' ? '#d4edda' : '#fff3cd'};
                    color: ${link.confidence === 'high' ? '#155724' : '#856404'};
                `
            });

            const typeBadge = createElement('span', '', link.type.replace('_', ' '), {
                style: `
                    display: inline-block;
                    padding: 3px 8px;
                    border-radius: 10px;
                    font-size: 10px;
                    background: #e9ecef;
                    color: #495057;
                `
            });

            header.appendChild(confidenceBadge);
            header.appendChild(typeBadge);

            const linkText = createElement('div', '', link.cleanedUrl || link.text, {
                style: `
                    font-family: monospace;
                    font-size: 12px;
                    word-break: break-all;
                    margin: 8px 0;
                    padding: 10px;
                    background: white;
                    border: 1px solid #dee2e6;
                    border-radius: 6px;
                `
            });

            const copyBtn = createElement('button', '', '📋 Copy Link', {
                style: `
                    padding: 6px 12px;
                    border: 1px solid #28a745;
                    background: white;
                    color: #28a745;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 12px;
                    margin-top: 8px;
                `
            });

            copyBtn.addEventListener('click', () => {
                const urlToCopy = link.cleanedUrl || link.text;
                navigator.clipboard.writeText(urlToCopy).then(() => {
                    copyBtn.textContent = '✅ Copied!';
                    copyBtn.style.background = '#d4edda';
                    log(`Copied video link: ${urlToCopy}`);
                    setTimeout(() => {
                        copyBtn.textContent = '📋 Copy Link';
                        copyBtn.style.background = 'white';
                    }, 2000);
                });
            });

            item.appendChild(header);
            item.appendChild(linkText);
            item.appendChild(copyBtn);
            videoList.appendChild(item);
        });
    }

    function updateVideoStats() {
        const stats = document.getElementById('cg-video-stats');
        if (stats) {
            const highConfidence = detectedVideoLinks.filter(link => link.confidence === 'high').length;
            const mediumConfidence = detectedVideoLinks.filter(link => link.confidence === 'medium').length;

            stats.innerHTML = `
                Found ${detectedVideoLinks.length} potential video links<br>
                <small>High Confidence: ${highConfidence} | Medium: ${mediumConfidence}</small>
            `;
        }
    }

    function copyAllVideoLinks() {
        if (detectedVideoLinks.length === 0) {
            showNotification('No video links to copy. Please scan first.', 'warning');
            return;
        }

        const allLinks = detectedVideoLinks.map(link => link.cleanedUrl || link.text).join('\n');
        navigator.clipboard.writeText(allLinks).then(() => {
            showNotification(`Copied ${detectedVideoLinks.length} video links!`, 'success');
            log(`Copied all video links to clipboard`);
        });
    }

    // Initialization
    function initializeScript() {
        log('Initializing CandidGirls Tools...');

        // Load visited posts from storage
        loadVisitedPosts();

        // Check if we're on a post detail page and mark it as visited
        const currentPostId = getCurrentPostIdFromUrl();
        if (currentPostId) {
            markPostAsVisited(currentPostId);
            log(`Current post ${currentPostId} marked as visited`);
        }

        // Remove existing elements
        const existingButton = document.getElementById(CONFIG.mainButtonId);
        const existingPanel = document.getElementById(CONFIG.mainPanelId);
        const existingDebugPanel = document.getElementById(CONFIG.debugPanelId);

        if (existingButton) existingButton.remove();
        if (existingPanel) existingPanel.remove();
        if (existingDebugPanel) existingDebugPanel.remove();

        // Create new elements
        const mainButton = createMainButton();
        const mainPanel = createMainPanel();
        const debugPanel = createDebugPanel();

        document.body.appendChild(mainButton);
        document.body.appendChild(mainPanel);
        document.body.appendChild(debugPanel);

        // Apply visited markers to category/listing pages
        setTimeout(() => {
            applyVisitedMarkers();
        }, 500);

        log('CandidGirls Tools initialized successfully', 'success');
    }

    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }

        .cg-main-panel::-webkit-scrollbar,
        .cg-image-list::-webkit-scrollbar,
        .cg-video-list::-webkit-scrollbar,
        .cg-debug-logs::-webkit-scrollbar {
            width: 8px;
        }

        .cg-main-panel::-webkit-scrollbar-track,
        .cg-image-list::-webkit-scrollbar-track,
        .cg-video-list::-webkit-scrollbar-track,
        .cg-debug-logs::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 4px;
        }

        .cg-main-panel::-webkit-scrollbar-thumb,
        .cg-image-list::-webkit-scrollbar-thumb,
        .cg-video-list::-webkit-scrollbar-thumb,
        .cg-debug-logs::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 4px;
        }

        .cg-main-panel::-webkit-scrollbar-thumb:hover,
        .cg-image-list::-webkit-scrollbar-thumb:hover,
        .cg-video-list::-webkit-scrollbar-thumb:hover,
        .cg-debug-logs::-webkit-scrollbar-thumb:hover {
            background: #555;
        }
    `;
    document.head.appendChild(style);

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeScript);
    } else {
        initializeScript();
    }

    // Re-initialize on navigation (for SPAs) and apply markers on DOM changes
    let lastUrl = location.href;
    let markersTimeout = null;

    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            log('Page navigation detected, reinitializing...');
            setTimeout(initializeScript, 1000);
        } else {
            // Content changed but URL didn't, reapply markers after a delay
            if (markersTimeout) clearTimeout(markersTimeout);
            markersTimeout = setTimeout(() => {
                applyVisitedMarkers();
            }, 1000);
        }
    }).observe(document, { subtree: true, childList: true });

})();
