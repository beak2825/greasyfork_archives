// ==UserScript==
// @name         Forum Post Archiver for phpBB (Private)
// @namespace    http://tampermonkey.net/
// @version      3.0.1
// @description  Archive all your posts from phpBB forums with ZIP and clipboard export options. Includes test mode and verbose logging.
// @author       sharmanhall
// @match        https://macserialjunkie.com/forum/search.php*
// @match        https://*/forum/search.php*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550805/Forum%20Post%20Archiver%20for%20phpBB%20%28Private%29.user.js
// @updateURL https://update.greasyfork.org/scripts/550805/Forum%20Post%20Archiver%20for%20phpBB%20%28Private%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Check if libraries are loaded
    console.log('JSZip loaded:', typeof JSZip !== 'undefined');
    console.log('saveAs loaded:', typeof saveAs !== 'undefined');

    // Manual fallback if @require didn't work
    if (typeof JSZip === 'undefined' || typeof saveAs === 'undefined') {
        console.warn('Libraries not loaded via @require, loading manually...');

        // Load JSZip
        if (typeof JSZip === 'undefined') {
            const jsZipScript = document.createElement('script');
            jsZipScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
            jsZipScript.onload = () => console.log('JSZip loaded manually');
            document.head.appendChild(jsZipScript);
        }

        // Load FileSaver
        if (typeof saveAs === 'undefined') {
            const fileSaverScript = document.createElement('script');
            fileSaverScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js';
            fileSaverScript.onload = () => console.log('FileSaver loaded manually');
            document.head.appendChild(fileSaverScript);
        }

        // Wait for libraries to load before continuing
        const checkLibraries = setInterval(() => {
            if (typeof JSZip !== 'undefined' && typeof saveAs !== 'undefined') {
                clearInterval(checkLibraries);
                console.log('All libraries loaded, initializing script...');
                initScript();
            }
        }, 100);
    } else {
        // Libraries already loaded, proceed immediately
        initScript();
    }

    function initScript() {



    // Configuration
    const CONFIG = {
        DELAY_BETWEEN_REQUESTS: 1500, // milliseconds
        POSTS_PER_PAGE: 15, // standard phpBB pagination
        MAX_STATUS_MESSAGES: 10, // Increased for more verbose logging
        ENABLE_RATE_LIMITING: true,
        DEBUG_MODE: true, // Enable verbose logging
        MAX_POSTS_PER_BATCH: 50, // Process posts in batches to avoid memory issues
        ZIP_COMPRESSION_LEVEL: 1 // Lower compression for faster processing (1-9)
    };

    // Add styles for the UI
    GM_addStyle(`
        #archiver-panel {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #2a2a2a;
            color: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
            z-index: 10000;
            min-width: 350px;
            max-width: 450px;
            font-family: Arial, sans-serif;
            max-height: 80vh;
            overflow-y: auto;
        }
        #archiver-panel h3 {
            margin-top: 0;
            color: #00ff00;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        #archiver-panel button {
            background: #00ff00;
            color: black;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
            width: 100%;
            margin-bottom: 10px;
        }
        #archiver-panel button:hover {
            background: #00dd00;
        }
        #archiver-panel button:disabled {
            background: #666;
            cursor: not-allowed;
            color: #ccc;
        }
        #archiver-panel button.test-btn {
            background: #ffaa00;
        }
        #archiver-panel button.test-btn:hover {
            background: #ff8800;
        }
        #archiver-panel button.clipboard-btn {
            background: #00aaff;
        }
        #archiver-panel button.clipboard-btn:hover {
            background: #0088dd;
        }
        #archiver-progress {
            margin: 10px 0;
            background: #444;
            border-radius: 5px;
            overflow: hidden;
            height: 25px;
            position: relative;
        }
        #archiver-progress-bar {
            background: linear-gradient(90deg, #00ff00, #00dd00);
            height: 100%;
            width: 0%;
            transition: width 0.3s ease;
        }
        #archiver-progress-text {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            font-size: 12px;
            font-weight: bold;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
        }
        #archiver-status {
            margin: 10px 0;
            font-size: 12px;
            color: #aaa;
            max-height: 200px;
            overflow-y: auto;
            padding: 5px;
            background: rgba(0,0,0,0.2);
            border-radius: 5px;
            font-family: 'Courier New', monospace;
        }
        .archiver-error {
            color: #ff4444 !important;
        }
        .archiver-success {
            color: #00ff00 !important;
        }
        .archiver-warning {
            color: #ffaa00 !important;
        }
        .archiver-debug {
            color: #8888ff !important;
            font-size: 11px;
        }
        #archiver-close {
            position: absolute;
            top: 10px;
            right: 10px;
            background: transparent !important;
            color: #888;
            border: none;
            font-size: 20px;
            cursor: pointer;
            padding: 0 !important;
            width: 25px !important;
            height: 25px !important;
            margin: 0 !important;
            line-height: 1;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        #archiver-close:hover {
            color: #fff;
            background: transparent !important;
        }
        .archiver-info {
            margin-top: 10px;
            padding: 10px;
            background: rgba(0,0,0,0.2);
            border-radius: 5px;
            font-size: 11px;
            color: #888;
        }
        .archiver-stats {
            margin-top: 10px;
            padding: 10px;
            background: rgba(0,255,0,0.1);
            border-radius: 5px;
            font-size: 12px;
            color: #aaa;
            display: none;
        }
        .archiver-stats.active {
            display: block;
        }
        #archiver-memory {
            color: #ff8800;
            font-size: 11px;
            margin-top: 5px;
        }
    `);

    // Check if we're on a search results page with author_id
    function isValidSearchPage() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.has('author_id') && urlParams.get('sr') === 'posts';
    }

    // State management
    let posts = [];
    let totalPosts = 0;
    let processedPosts = 0;
    let isRunning = false;
    let authorId = null;
    let authorName = 'User';
    let startTime = null;
    let lastError = null;

    // Debug logging
    function debugLog(message, data = null) {
        if (CONFIG.DEBUG_MODE) {
            console.log(`[Forum Archiver] ${message}`, data || '');
            updateStatus(`[DEBUG] ${message}`, 'debug');
        }
    }

    // Create UI panel
    function createUI() {
        // Don't create UI if not on valid search page
        if (!isValidSearchPage()) {
            console.log('Forum Post Archiver: Not on a valid author search page');
            return;
        }

        // Get author info
        const urlParams = new URLSearchParams(window.location.search);
        authorId = urlParams.get('author_id');

        // Try to get username from page
        const authorLink = document.querySelector('.postprofile .author a');
        if (authorLink) {
            authorName = authorLink.textContent.trim();
        }

        // Count total posts from search results
        const searchInfo = document.querySelector('.searchresults-title') ||
                          document.querySelector('.pagination');
        let totalPostsFound = 616; // default
        if (searchInfo) {
            const match = searchInfo.textContent.match(/(\d+)\s+matches/);
            if (match) {
                totalPostsFound = parseInt(match[1]);
            }
        }

        const panel = document.createElement('div');
        panel.id = 'archiver-panel';
        panel.innerHTML = `
            <button id="archiver-close" title="Close">×</button>
            <h3>📦 POST ARCHIVER v2.0</h3>
            <div class="archiver-info">
                <strong>Author:</strong> ${authorName} (ID: ${authorId})<br>
                <strong>Posts found:</strong> <span id="total-posts">${totalPostsFound}</span><br>
                <strong>Request delay:</strong> ${CONFIG.DELAY_BETWEEN_REQUESTS}ms<br>
                <strong>Debug mode:</strong> ${CONFIG.DEBUG_MODE ? 'ON' : 'OFF'}
            </div>
            <button id="test-zip" class="test-btn" title="Test ZIP creation with 3 posts">🧪 Test ZIP (3 posts)</button>
            <button id="start-archive">📥 Start Full Archive</button>
            <button id="copy-clipboard" class="clipboard-btn" style="display:none;">📋 Copy All to Clipboard</button>
            <button id="stop-archive" style="display:none;">⏹️ Stop</button>
            <div id="archiver-progress" style="display:none;">
                <div id="archiver-progress-bar"></div>
                <span id="archiver-progress-text">0%</span>
            </div>
            <div class="archiver-stats" id="archiver-stats">
                <strong>Statistics:</strong><br>
                <span id="stats-content"></span>
                <div id="archiver-memory"></div>
            </div>
            <div id="archiver-status"></div>
        `;
        document.body.appendChild(panel);

        // Event listeners
        document.getElementById('test-zip').addEventListener('click', testZipCreation);
        document.getElementById('start-archive').addEventListener('click', startArchiving);
        document.getElementById('copy-clipboard').addEventListener('click', copyToClipboard);
        document.getElementById('stop-archive').addEventListener('click', stopArchiving);
        document.getElementById('archiver-close').addEventListener('click', () => {
            if (isRunning && !confirm('Archive in progress. Close anyway?')) {
                return;
            }
            isRunning = false;
            panel.remove();
        });

        debugLog('UI created successfully');
    }

    function updateStatus(message, type = 'normal') {
        const status = document.getElementById('archiver-status');
        if (!status) return;

        const timestamp = new Date().toLocaleTimeString();
        const classMap = {
            'error': 'archiver-error',
            'success': 'archiver-success',
            'warning': 'archiver-warning',
            'debug': 'archiver-debug',
            'normal': ''
        };
        const className = classMap[type] || '';

        const msgDiv = document.createElement('div');
        msgDiv.className = className;
        msgDiv.textContent = `[${timestamp}] ${message}`;
        status.insertBefore(msgDiv, status.firstChild);

        // Keep only last N messages
        const messages = status.querySelectorAll('div');
        if (messages.length > CONFIG.MAX_STATUS_MESSAGES) {
            messages[messages.length - 1].remove();
        }
    }

    function updateProgress() {
        const percentage = Math.round((processedPosts / totalPosts) * 100);
        const progressBar = document.getElementById('archiver-progress-bar');
        const progressText = document.getElementById('archiver-progress-text');

        if (progressBar && progressText) {
            progressBar.style.width = percentage + '%';
            progressText.textContent = `${processedPosts}/${totalPosts} (${percentage}%)`;
        }

        // Update stats
        if (startTime) {
            const elapsed = (Date.now() - startTime) / 1000;
            const postsPerSecond = processedPosts / elapsed;
            const remaining = (totalPosts - processedPosts) / postsPerSecond;

            const statsDiv = document.getElementById('archiver-stats');
            const statsContent = document.getElementById('stats-content');
            if (statsDiv && statsContent) {
                statsDiv.classList.add('active');
                statsContent.innerHTML = `
                    Processed: ${processedPosts}/${totalPosts}<br>
                    Elapsed: ${Math.round(elapsed)}s<br>
                    Speed: ${postsPerSecond.toFixed(2)} posts/sec<br>
                    ETA: ${Math.round(remaining)}s
                `;
            }
        }

        // Memory usage estimation
        updateMemoryUsage();
    }

    function updateMemoryUsage() {
        if (performance.memory) {
            const memDiv = document.getElementById('archiver-memory');
            if (memDiv) {
                const used = (performance.memory.usedJSHeapSize / 1048576).toFixed(2);
                const limit = (performance.memory.jsHeapSizeLimit / 1048576).toFixed(2);
                memDiv.textContent = `Memory: ${used}MB / ${limit}MB`;
            }
        }
    }

    async function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function fetchPage(url) {
        debugLog(`Fetching: ${url}`);
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (compatible; ForumArchiver/2.0)'
                },
                timeout: 30000, // 30 second timeout
                onload: function(response) {
                    if (response.status === 200) {
                        debugLog(`Fetch successful: ${url}`);
                        resolve(response.responseText);
                    } else {
                        debugLog(`Fetch failed with status ${response.status}: ${url}`);
                        reject(new Error(`HTTP ${response.status}`));
                    }
                },
                onerror: function(error) {
                    debugLog(`Fetch error: ${url}`, error);
                    reject(error);
                },
                ontimeout: function() {
                    debugLog(`Fetch timeout: ${url}`);
                    reject(new Error('Request timeout'));
                }
            });
        });
    }

    function parseSearchPage(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const postElements = doc.querySelectorAll('.search.post');
        const pagePosts = [];

        postElements.forEach(element => {
            const postLink = element.querySelector('a[href*="viewtopic.php?p="]');
            if (postLink) {
                const postIdMatch = postLink.href.match(/p=(\d+)/);
                if (!postIdMatch) return;

                const postId = postIdMatch[1];
                const titleElement = element.querySelector('h3 a');
                const dateElement = element.querySelector('.search-result-date');
                const forumElement = element.querySelector('dd a[href*="viewforum.php"]');
                const topicElement = element.querySelector('dd a[href*="viewtopic.php?t="]');

                pagePosts.push({
                    id: postId,
                    title: titleElement ? titleElement.textContent.trim() : 'Untitled',
                    date: dateElement ? dateElement.textContent.trim() : 'Unknown date',
                    forum: forumElement ? forumElement.textContent.trim() : 'Unknown forum',
                    topic: topicElement ? topicElement.textContent.trim() : 'Unknown topic',
                    editUrl: `${window.location.origin}${window.location.pathname.replace('search.php', 'posting.php')}?mode=edit&p=${postId}`,
                    viewUrl: postLink.href
                });
            }
        });

        debugLog(`Parsed ${pagePosts.length} posts from search page`);
        return pagePosts;
    }

    async function fetchPostContent(post, retryCount = 0) {
        try {
            debugLog(`Fetching content for post ${post.id} (attempt ${retryCount + 1})`);
            const html = await fetchPage(post.editUrl);
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            const messageTextarea = doc.querySelector('#message');
            const subjectInput = doc.querySelector('#subject');

            if (messageTextarea) {
                post.content = messageTextarea.value;
                post.subject = subjectInput ? subjectInput.value : post.title;
                debugLog(`Content fetched successfully for post ${post.id}`);
                return true;
            } else {
                // Check various error conditions
                if (html.includes('You are not authorised') || html.includes('not authorized')) {
                    post.content = '[Unable to fetch content - no edit permission]';
                    post.error = 'No edit permission';
                } else if (html.includes('The requested post does not exist')) {
                    post.content = '[Post not found]';
                    post.error = 'Post not found';
                } else {
                    post.content = '[Unable to fetch content - unknown error]';
                    post.error = 'Content not found';
                }
                debugLog(`Content fetch failed for post ${post.id}: ${post.error}`);
                return false;
            }
        } catch (error) {
            debugLog(`Error fetching post ${post.id}: ${error.message}`);

            // Retry logic
            if (retryCount < 2) {
                updateStatus(`Retrying post ${post.id}...`, 'warning');
                await delay(3000);
                return fetchPostContent(post, retryCount + 1);
            }

            post.content = `[Error fetching content: ${error.message}]`;
            post.error = error.message;
            return false;
        }
    }

    async function getAllSearchPages(limit = null) {
        const allPosts = [];
        const totalPostsElement = document.getElementById('total-posts');
        const totalExpected = totalPostsElement ? parseInt(totalPostsElement.textContent) : 0;
        const totalPages = Math.ceil((limit || totalExpected) / CONFIG.POSTS_PER_PAGE);

        updateStatus(`Fetching ${totalPages} pages of search results...`);

        for (let i = 0; i < totalPages; i++) {
            if (!isRunning) break;

            const start = i * CONFIG.POSTS_PER_PAGE;
            const urlParams = new URLSearchParams(window.location.search);
            urlParams.set('start', start);
            const url = `${window.location.origin}${window.location.pathname}?${urlParams.toString()}`;

            try {
                const html = await fetchPage(url);
                const pagePosts = parseSearchPage(html);
                allPosts.push(...pagePosts);
                updateStatus(`Fetched page ${i + 1}/${totalPages} (${pagePosts.length} posts)`);

                if (limit && allPosts.length >= limit) {
                    return allPosts.slice(0, limit);
                }

                if (CONFIG.ENABLE_RATE_LIMITING) {
                    await delay(1000);
                }
            } catch (error) {
                updateStatus(`Error fetching page ${i + 1}: ${error.message}`, 'error');
                lastError = error.message;
            }
        }

        return allPosts;
    }

    function sanitizeFilename(str) {
        return str.replace(/[^a-z0-9_\-]/gi, '_').substring(0, 50);
    }

    function createPostFile(post) {
        const datePart = post.date.replace(/[^a-z0-9]/gi, '_');
        const subjectPart = sanitizeFilename(post.subject || post.title);
        const fileName = `${post.id}_${datePart}_${subjectPart}.bbcode`;

        const fileContent = `========================================
POST METADATA
========================================
Post ID: ${post.id}
Subject: ${post.subject || post.title}
Date: ${post.date}
Forum: ${post.forum}
Topic: ${post.topic}
View URL: ${post.viewUrl}
Edit URL: ${post.editUrl}
Archive Date: ${new Date().toISOString()}
${post.error ? `Error: ${post.error}` : ''}

========================================
POST CONTENT (BBCode)
========================================
${post.content || '[No content available]'}
`;

        return { name: fileName, content: fileContent };
    }

    async function testZipCreation() {
        updateStatus('Starting ZIP test with 3 posts...', 'success');
        debugLog('Starting test ZIP creation');

        const testBtn = document.getElementById('test-zip');
        testBtn.disabled = true;

        try {
            // Create test data
            const testPosts = [
                {
                    id: 'test1',
                    title: 'Test Post 1',
                    subject: 'Test Subject 1',
                    date: '2024-01-01',
                    forum: 'Test Forum',
                    topic: 'Test Topic',
                    content: '[b]This is a test post[/b]\n\nWith some BBCode content.',
                    viewUrl: 'http://example.com/post1',
                    editUrl: 'http://example.com/edit1'
                },
                {
                    id: 'test2',
                    title: 'Test Post 2',
                    subject: 'Test Subject 2',
                    date: '2024-01-02',
                    forum: 'Test Forum',
                    topic: 'Test Topic 2',
                    content: 'Another test post with [url=http://example.com]a link[/url]',
                    viewUrl: 'http://example.com/post2',
                    editUrl: 'http://example.com/edit2'
                },
                {
                    id: 'test3',
                    title: 'Test Post 3 with Error',
                    subject: 'Test Subject 3',
                    date: '2024-01-03',
                    forum: 'Test Forum 2',
                    topic: 'Test Topic 3',
                    content: '[Unable to fetch content - no edit permission]',
                    error: 'No edit permission',
                    viewUrl: 'http://example.com/post3',
                    editUrl: 'http://example.com/edit3'
                }
            ];

            updateStatus('Creating test ZIP with 3 posts...', 'normal');
            debugLog('Test posts created', testPosts);

            const zip = new JSZip();

            // Add test posts to ZIP
            testPosts.forEach(post => {
                const forumName = sanitizeFilename(post.forum);
                const folder = zip.folder(forumName);
                const file = createPostFile(post);
                folder.file(file.name, file.content);
                debugLog(`Added test file: ${forumName}/${file.name}`);
            });

            // Add README
            zip.file('README.txt', 'This is a TEST archive with 3 sample posts.\nIf this downloads successfully, ZIP creation is working!');

            updateStatus('Generating test ZIP file...', 'normal');
            debugLog('Starting ZIP generation');

            const blob = await zip.generateAsync({
                type: 'blob',
                compression: 'DEFLATE',
                compressionOptions: { level: CONFIG.ZIP_COMPRESSION_LEVEL }
            }, function(metadata) {
                debugLog(`ZIP progress: ${metadata.percent.toFixed(2)}%`);
            });

            debugLog(`ZIP blob created, size: ${blob.size} bytes`);

            const filename = `TEST_Archive_${new Date().toISOString().replace(/[:.]/g, '-')}.zip`;
            saveAs(blob, filename);

            updateStatus('✅ TEST ZIP created successfully! Check your downloads.', 'success');
            updateStatus(`Test file: ${filename} (${(blob.size/1024).toFixed(2)} KB)`, 'success');
            debugLog('Test ZIP saved successfully');

        } catch (error) {
            updateStatus(`❌ TEST ZIP FAILED: ${error.message}`, 'error');
            debugLog('Test ZIP creation failed', error);
            console.error('ZIP Test Error:', error);
        } finally {
            testBtn.disabled = false;
        }
    }

    async function startArchiving() {
        if (isRunning) {
            updateStatus('Archive process already running', 'warning');
            return;
        }

        isRunning = true;
        posts = [];
        processedPosts = 0;
        startTime = Date.now();

        const startBtn = document.getElementById('start-archive');
        const stopBtn = document.getElementById('stop-archive');
        const progressDiv = document.getElementById('archiver-progress');
        const clipboardBtn = document.getElementById('copy-clipboard');

        if (startBtn) startBtn.style.display = 'none';
        if (stopBtn) stopBtn.style.display = 'block';
        if (progressDiv) progressDiv.style.display = 'block';
        if (clipboardBtn) clipboardBtn.style.display = 'none';

        updateStatus('Starting archive process...', 'success');
        debugLog('Archive process started');

        try {
            // Get all posts from search results
            posts = await getAllSearchPages();
            totalPosts = posts.length;

            if (totalPosts === 0) {
                updateStatus('No posts found to archive', 'error');
                stopArchiving();
                return;
            }

            updateStatus(`Found ${totalPosts} posts to archive`, 'success');
            debugLog(`Total posts to archive: ${totalPosts}`);

            // Fetch content for each post
            let successCount = 0;
            let errorCount = 0;

            for (const post of posts) {
                if (!isRunning) break;

                const shortTitle = post.title.substring(0, 50) + (post.title.length > 50 ? '...' : '');
                updateStatus(`Fetching post ${post.id}: ${shortTitle}`);

                const success = await fetchPostContent(post);

                if (success) {
                    successCount++;
                } else {
                    errorCount++;
                    if (post.error) {
                        updateStatus(`⚠️ ${post.error} for post ${post.id}`, 'warning');
                    }
                }

                processedPosts++;
                updateProgress();

                // Rate limiting
                if (CONFIG.ENABLE_RATE_LIMITING) {
                    await delay(CONFIG.DELAY_BETWEEN_REQUESTS);
                }

                // Periodic memory check
                if (processedPosts % 50 === 0) {
                    updateMemoryUsage();
                    // Small delay to let browser breathe
                    await delay(100);
                }
            }

            if (isRunning) {
                updateStatus(`Fetched ${successCount} posts successfully (${errorCount} errors)`, 'success');

                // Show clipboard button
                if (clipboardBtn) clipboardBtn.style.display = 'block';

                // Try to create ZIP
                updateStatus('Creating ZIP archive...', 'normal');
                try {
                    await createZipArchive();
                } catch (zipError) {
                    updateStatus(`❌ ZIP creation failed: ${zipError.message}`, 'error');
                    updateStatus('💡 Use "Copy to Clipboard" button to export your data', 'warning');
                    debugLog('ZIP creation failed', zipError);
                }
            }
        } catch (error) {
            updateStatus(`Archive failed: ${error.message}`, 'error');
            debugLog('Archive process failed', error);
        } finally {
            if (startBtn) startBtn.style.display = 'block';
            if (stopBtn) stopBtn.style.display = 'none';
            isRunning = false;
        }
    }

    function stopArchiving() {
        isRunning = false;
        updateStatus('Archive process stopped by user', 'warning');
        debugLog('Archive process stopped');
        const startBtn = document.getElementById('start-archive');
        const stopBtn = document.getElementById('stop-archive');
        const clipboardBtn = document.getElementById('copy-clipboard');
        if (startBtn) startBtn.style.display = 'block';
        if (stopBtn) stopBtn.style.display = 'none';
        if (posts.length > 0 && clipboardBtn) {
            clipboardBtn.style.display = 'block';
        }
    }

    async function createZipArchive() {
    debugLog('Starting ZIP archive creation');

    const zip = new JSZip();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const safeAuthorName = sanitizeFilename(authorName);

    // Process in batches to avoid memory issues
    const batchSize = CONFIG.MAX_POSTS_PER_BATCH;
    const batches = Math.ceil(posts.length / batchSize);

    debugLog(`Processing ${posts.length} posts in ${batches} batches`);

    // Create folders by forum
    const forumFolders = {};

    for (let i = 0; i < batches; i++) {
        const start = i * batchSize;
        const end = Math.min(start + batchSize, posts.length);
        const batchPosts = posts.slice(start, end);

        updateStatus(`Processing batch ${i + 1}/${batches} (posts ${start + 1}-${end})`, 'normal');

        batchPosts.forEach(post => {
            const forumName = sanitizeFilename(post.forum);

            if (!forumFolders[forumName]) {
                forumFolders[forumName] = zip.folder(forumName);
            }

            const file = createPostFile(post);
            forumFolders[forumName].file(file.name, file.content);
        });

        // Small delay between batches
        await delay(100);
    }

    // Add summary file
    const successCount = posts.filter(p => !p.error).length;
    const errorCount = posts.filter(p => p.error).length;

    const summary = `Forum Post Archive
==================
User: ${authorName} (ID: ${authorId})
Total Posts: ${posts.length}
Successfully Archived: ${successCount}
Errors: ${errorCount}
Archive Date: ${new Date().toString()}
Forum: ${window.location.hostname}

Posts by Forum:
${Object.keys(forumFolders).map(f => {
    const forumPosts = posts.filter(p => sanitizeFilename(p.forum) === f);
    return `- ${f}: ${forumPosts.length} posts`;
}).join('\n')}

${errorCount > 0 ? `\nPosts with Errors:\n${posts.filter(p => p.error).map(p => `- Post ${p.id}: ${p.error}`).join('\n')}` : ''}

Notes:
- Files are in BBCode format
- Posts you don't have permission to edit show as [Unable to fetch content]
- Archive created with Forum Post Archiver userscript v2.0
`;

    zip.file('README.txt', summary);

    // Generate and download ZIP with progress monitoring
// Generate and download ZIP with progress monitoring
try {
    updateStatus('Generating ZIP file (this may take a moment)...', 'normal');
    debugLog('Starting ZIP blob generation');
    debugLog(`Total posts in archive: ${posts.length}`);
    debugLog(`Total forums: ${Object.keys(forumFolders).length}`);

    // Log memory before ZIP generation
    if (performance.memory) {
        debugLog(`Memory before ZIP: ${(performance.memory.usedJSHeapSize / 1048576).toFixed(2)}MB`);
    }

    let lastProgress = 0;
    let progressCallCount = 0;

    debugLog('Calling zip.generateAsync...');

    // Add timeout wrapper
    const zipPromise = new Promise(async (resolve, reject) => {
        const timeout = setTimeout(() => {
            reject(new Error('ZIP generation timeout after 60 seconds'));
        }, 60000); // 60 second timeout

        try {
            debugLog('Inside ZIP promise, starting generation');

            const blob = await zip.generateAsync({
                type: 'blob',
                compression: 'DEFLATE',
                compressionOptions: { level: CONFIG.ZIP_COMPRESSION_LEVEL }
            }, function(metadata) {
                progressCallCount++;
                const progress = Math.round(metadata.percent);

                // Log every 5% instead of 10% for more feedback
                if (progress !== lastProgress && progress % 5 === 0) {
                    updateStatus(`ZIP compression: ${progress}%`, 'normal');
                    debugLog(`ZIP generation progress: ${metadata.percent.toFixed(2)}% (callback #${progressCallCount})`);
                    lastProgress = progress;
                }

                // Also log the first callback
                if (progressCallCount === 1) {
                    debugLog(`First progress callback received: ${metadata.percent.toFixed(2)}%`);
                }
            });

            clearTimeout(timeout);
            debugLog('zip.generateAsync completed successfully');
            resolve(blob);

        } catch (innerError) {
            clearTimeout(timeout);
            debugLog(`zip.generateAsync threw error: ${innerError.message}`);
            console.error('Full ZIP generation error:', innerError);
            reject(innerError);
        }
    });

    debugLog('Awaiting ZIP promise...');
    const blob = await zipPromise;

    debugLog(`ZIP blob created successfully, size: ${blob.size} bytes (${(blob.size / 1048576).toFixed(2)}MB)`);
    debugLog(`Progress callbacks received: ${progressCallCount}`);

    // Log memory after ZIP generation
    if (performance.memory) {
        debugLog(`Memory after ZIP: ${(performance.memory.usedJSHeapSize / 1048576).toFixed(2)}MB`);
    }

    // Verify blob is valid
    if (!blob || blob.size === 0) {
        throw new Error('Generated blob is empty or invalid');
    }

    const filename = `Forum_Archive_${safeAuthorName}_${timestamp}.zip`;
    debugLog(`Filename: ${filename}`);

    updateStatus(`ZIP ready, initiating download...`, 'normal');
    debugLog('Calling saveAs...');

    try {
        saveAs(blob, filename);
        debugLog('saveAs called successfully');
    } catch (saveError) {
        debugLog(`saveAs error: ${saveError.message}`);
        console.error('Full saveAs error:', saveError);
        throw saveError;
    }

    const sizeKB = (blob.size / 1024).toFixed(2);
    const sizeMB = (blob.size / 1048576).toFixed(2);

    updateStatus(`✅ Archive completed! ${successCount} posts saved successfully.`, 'success');
    updateStatus(`📦 File: ${filename} (${sizeMB > 1 ? sizeMB + ' MB' : sizeKB + ' KB'})`, 'success');

    if (errorCount > 0) {
        updateStatus(`⚠️ ${errorCount} posts had errors (see README.txt)`, 'warning');
    }

    debugLog('ZIP archive saved successfully');
    debugLog('=== ZIP Generation Complete ===');

} catch (error) {
    debugLog('=== ZIP Generation Failed ===');
    debugLog(`Error type: ${error.constructor.name}`);
    debugLog(`Error message: ${error.message}`);
    debugLog(`Error stack: ${error.stack}`);
    console.error('Full ZIP generation error object:', error);

    // Check for specific error types
    if (error.message.includes('timeout')) {
        updateStatus('ZIP generation timed out - archive may be too large', 'error');
        updateStatus('Try using the clipboard export instead', 'warning');
    } else if (error.message.includes('memory')) {
        updateStatus('Out of memory - archive too large for browser', 'error');
        updateStatus('Try closing other tabs and retrying', 'warning');
    } else {
        updateStatus(`ZIP error: ${error.message}`, 'error');
    }

    throw error;
}
}

async function copyToClipboard() {
    if (!posts || posts.length === 0) {
        updateStatus('No posts to copy', 'error');
        return;
    }

    const clipboardBtn = document.getElementById('copy-clipboard');
    clipboardBtn.disabled = true;

    try {
        updateStatus('Preparing clipboard export...', 'normal');
        debugLog(`Copying ${posts.length} posts to clipboard`);

        // Create text format for all posts
        let clipboardText = `FORUM POST ARCHIVE
==================
User: ${authorName} (ID: ${authorId})
Total Posts: ${posts.length}
Archive Date: ${new Date().toString()}
Forum: ${window.location.hostname}

==========================================

`;

        // Group posts by forum
        const postsByForum = {};
        posts.forEach(post => {
            const forum = post.forum || 'Unknown Forum';
            if (!postsByForum[forum]) {
                postsByForum[forum] = [];
            }
            postsByForum[forum].push(post);
        });

        // Add posts to clipboard text
        Object.keys(postsByForum).forEach(forum => {
            clipboardText += `\n════════════════════════════════════════
FORUM: ${forum}
════════════════════════════════════════\n\n`;

            postsByForum[forum].forEach(post => {
                clipboardText += `----------------------------------------
Post ID: ${post.id}
Subject: ${post.subject || post.title}
Date: ${post.date}
Topic: ${post.topic}
URL: ${post.viewUrl}
${post.error ? `Error: ${post.error}` : ''}
----------------------------------------

${post.content || '[No content available]'}

========================================

`;
            });
        });

        // Try GM_setClipboard first (more reliable)
        if (typeof GM_setClipboard !== 'undefined') {
            GM_setClipboard(clipboardText);
            updateStatus('✅ All posts copied to clipboard!', 'success');
            updateStatus(`📋 ${posts.length} posts exported as text`, 'success');
            debugLog('Clipboard export successful using GM_setClipboard');
        } else {
            // Fallback to navigator.clipboard
            await navigator.clipboard.writeText(clipboardText);
            updateStatus('✅ All posts copied to clipboard!', 'success');
            updateStatus(`📋 ${posts.length} posts exported as text`, 'success');
            debugLog('Clipboard export successful using navigator.clipboard');
        }

    } catch (error) {
        updateStatus(`❌ Clipboard copy failed: ${error.message}`, 'error');
        debugLog('Clipboard export failed', error);

        // Fallback: Create textarea for manual copy
        updateStatus('Creating manual copy option...', 'warning');

        // Create container
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '0';
        container.style.left = '0';
        container.style.right = '0';
        container.style.bottom = '0';
        container.style.backgroundColor = 'rgba(0,0,0,0.8)';
        container.style.zIndex = '10001';
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.justifyContent = 'center';

        // Create inner wrapper
        const wrapper = document.createElement('div');
        wrapper.style.width = '80%';
        wrapper.style.maxWidth = '800px';
        wrapper.style.backgroundColor = '#fff';
        wrapper.style.borderRadius = '10px';
        wrapper.style.padding = '20px';
        wrapper.style.boxShadow = '0 4px 6px rgba(0,0,0,0.3)';

        // Create header
        const header = document.createElement('div');
        header.innerHTML = '<h3 style="margin-top:0;color:#333;">Manual Copy Required</h3><p style="color:#666;">Select all text below and press Ctrl+C (or Cmd+C on Mac) to copy:</p>';
        wrapper.appendChild(header);

        // Create textarea
        const textarea = document.createElement('textarea');
        textarea.value = clipboardText;
        textarea.style.width = '100%';
        textarea.style.height = '400px';
        textarea.style.border = '2px solid #00ff00';
        textarea.style.padding = '10px';
        textarea.style.fontFamily = 'monospace';
        textarea.style.fontSize = '12px';
        textarea.style.resize = 'vertical';
        wrapper.appendChild(textarea);

        // Create button container
        const buttonContainer = document.createElement('div');
        buttonContainer.style.marginTop = '10px';
        buttonContainer.style.textAlign = 'right';

        // Create select all button
        const selectBtn = document.createElement('button');
        selectBtn.textContent = 'Select All';
        selectBtn.style.padding = '10px 20px';
        selectBtn.style.marginRight = '10px';
        selectBtn.style.backgroundColor = '#00aaff';
        selectBtn.style.color = '#fff';
        selectBtn.style.border = 'none';
        selectBtn.style.borderRadius = '5px';
        selectBtn.style.cursor = 'pointer';
        selectBtn.onclick = () => {
            textarea.select();
            textarea.setSelectionRange(0, 99999999);
        };
        buttonContainer.appendChild(selectBtn);

        // Create close button
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Close';
        closeBtn.style.padding = '10px 20px';
        closeBtn.style.backgroundColor = '#ff4444';
        closeBtn.style.color = '#fff';
        closeBtn.style.border = 'none';
        closeBtn.style.borderRadius = '5px';
        closeBtn.style.cursor = 'pointer';
        closeBtn.onclick = () => {
            container.remove();
        };
        buttonContainer.appendChild(closeBtn);

        wrapper.appendChild(buttonContainer);
        container.appendChild(wrapper);
        document.body.appendChild(container);

        // Auto-select text
        textarea.select();
        textarea.setSelectionRange(0, 99999999);

        updateStatus('📋 Text selected - press Ctrl+C to copy', 'warning');
    } finally {
        clipboardBtn.disabled = false;
    }
}

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createUI);
} else {
    createUI();
}

// Log version
console.log('Forum Post Archiver v2.0 loaded - Enhanced with verbose logging and clipboard export');
    }
})();