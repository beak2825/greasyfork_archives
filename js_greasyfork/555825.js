// ==UserScript==
// @name        WTR-LAB Auto Chapter Downloader
// @namespace   Violentmonkey Scripts
// @match       https://wtr-lab.com/en/novel/*
// @grant       none
// @version     1.1
// @author      Joni911
// @license MIT
// @description Automatically download 20 chapters continuously until error occurs, then refresh page
// @downloadURL https://update.greasyfork.org/scripts/555825/WTR-LAB%20Auto%20Chapter%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/555825/WTR-LAB%20Auto%20Chapter%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const CHAPTERS_TO_DOWNLOAD = 20;
    const DELAY_BETWEEN_CHAPTERS = 500; // milliseconds
    
    // Storage keys for tracking download progress and failed chapters
    const PROGRESS_KEY = 'wtrlab_auto_download_progress';
    const FAILED_CHAPTERS_KEY = 'wtrlab_failed_chapters_history';
    
    // Create UI elements
    const menu = document.createElement("div");
    menu.style.cssText = `
        position: fixed; 
        top: 60px; 
        right: 20px; 
        background: #fff; 
        border-radius: 12px;
        padding: 15px; 
        max-height: 80vh; 
        overflow-y: auto; 
        z-index: 9999; 
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        display: none; 
        width: 400px;
        font-family: Arial, sans-serif;
    `;

    menu.innerHTML = `
        <div id="menuHeader" style="
            position: sticky; top: 0; background: #fff; z-index: 10;
            padding: 10px; border-bottom: 1px solid #ddd; margin: -15px -15px 15px -15px;
        ">
            <h3 style="margin: 0 0 10px 0; color: #333;">Auto Chapter Downloader</h3>
            <div style="display:flex; flex-direction: column; gap: 10px;">
                <div>
                    <label>Start Chapter No: <input type="number" id="startChapter" placeholder="Chapter number" style="width: 100px; padding: 5px;"></label>
                </div>
                <div>
                    <label>End Chapter No: <input type="number" id="endChapter" placeholder="e.g., 60" style="width: 100px; padding: 5px;"></label>
                </div>
                <div>
                    <label>Delay (ms): <input type="number" id="delayTime" value="${DELAY_BETWEEN_CHAPTERS}" min="100" max="5000" style="width: 100px; padding: 5px;"></label>
                </div>
                <div style="display:flex; gap: 10px;">
                    <button id="startDownloadBtn" style="flex:1; background: #4CAF50; color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer;">Start Auto Download</button>
                    <button id="stopDownloadBtn" style="flex:1; background: #f44336; color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer;">Stop</button>
                    <button id="clearProgressBtn" style="flex:1; background: #ff9800; color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer;">Clear Progress</button>
                </div>
            </div>
        </div>
        
        <div id="progressSection" style="margin-top: 15px;">
            <h4>Download Progress</h4>
            <div id="progressInfo" style="margin-bottom: 10px; color: #666; font-size: 14px;">
                Ready to start downloading...
            </div>
            <div id="chapterList" style="max-height: 300px; overflow-y: auto; border: 1px solid #eee; padding: 10px; background: #fafafa;">
                <div>No downloads in progress</div>
            </div>
        </div>

        <div id="failedChapterSection" style="margin-top: 15px;">
            <h4 style="display: flex; justify-content: space-between; align-items: center;">
                <span>Failed Chapters</span>
                <button id="clearFailedHistoryBtn" style="background: #ff5722; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 12px;">Clear History</button>
            </h4>
            <div id="failedChapterList" style="max-height: 200px; overflow-y: auto; border: 1px solid #eee; padding: 10px; background: #fffafa;">
                <div id="noFailedChapters">No failed chapters to show</div>
            </div>
            <div id="resumeFailedSection" style="margin-top: 10px; display: none;">
                <button id="resumeFailedBtn" style="width: 100%; background: #9c27b0; color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer;">Resume Failed Chapters</button>
            </div>
            <div id="resumeFromLastSection" style="margin-top: 10px;">
                <button id="resumeFromLastBtn" style="width: 100%; background: #2196F3; color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer;">Resume From Last Position (to Target: <span id="targetChapterDisplay">--</span>)</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(menu);

    // Toggle button
    const toggleBtn = document.createElement("button");
    toggleBtn.textContent = "🤖 Auto Download";
    toggleBtn.style.cssText = `
        position: fixed; 
        top: 10px; 
        right: 10px; 
        z-index: 999999; 
        background: #2196F3; 
        color: white; 
        border: none; 
        padding: 10px 15px; 
        border-radius: 5px; 
        cursor: pointer;
        font-weight: bold;
    `;
    toggleBtn.onclick = () => menu.style.display = menu.style.display === "none" ? "block" : "none";
    document.body.appendChild(toggleBtn);

    // UI elements
    const startDownloadBtn = document.getElementById("startDownloadBtn");
    const stopDownloadBtn = document.getElementById("stopDownloadBtn");
    const clearProgressBtn = document.getElementById("clearProgressBtn");
    const startChapterInput = document.getElementById("startChapter");
    const endChapterInput = document.getElementById("endChapter");
    const delayTimeInput = document.getElementById("delayTime");
    const progressInfo = document.getElementById("progressInfo");
    const chapterList = document.getElementById("chapterList");

    // State variables
    let isDownloading = false;
    let currentChapter = 1;
    let endChapter = 20; // Default to 20 chapters from start
    let delayTime = DELAY_BETWEEN_CHAPTERS;
    let downloadedChapters = [];
    let failedChapters = [];

    // Function to manage failed chapters history
    function getFailedChaptersHistory() {
        try {
            const saved = localStorage.getItem(FAILED_CHAPTERS_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.warn("Could not load failed chapters history:", e);
            return [];
        }
    }

    // Function to add failed chapter to history
    function addFailedChapter(novelId, novelTitle, chapterNum, errorMessage, timestamp = Date.now()) {
        const failedChapters = getFailedChaptersHistory();
        const existingIndex = failedChapters.findIndex(item =>
            item.novelId === novelId && item.chapterNum === chapterNum
        );

        if (existingIndex !== -1) {
            // Update existing failed chapter entry
            failedChapters[existingIndex] = {
                ...failedChapters[existingIndex],
                errorMessage,
                lastAttempt: timestamp,
                retryCount: failedChapters[existingIndex].retryCount + 1
            };
        } else {
            // Add new failed chapter entry
            failedChapters.push({
                novelId,
                novelTitle,
                chapterNum,
                errorMessage,
                firstFailed: timestamp,
                lastAttempt: timestamp,
                retryCount: 1
            });
        }

        localStorage.setItem(FAILED_CHAPTERS_KEY, JSON.stringify(failedChapters));
        updateFailedChaptersDisplay();
    }

    // Function to remove failed chapter from history
    function removeFailedChapter(novelId, chapterNum) {
        let failedChapters = getFailedChaptersHistory();
        failedChapters = failedChapters.filter(item =>
            !(item.novelId === novelId && item.chapterNum === chapterNum)
        );
        localStorage.setItem(FAILED_CHAPTERS_KEY, JSON.stringify(failedChapters));
        updateFailedChaptersDisplay();
    }

    // Function to clear all failed chapter history
    function clearFailedChaptersHistory() {
        localStorage.removeItem(FAILED_CHAPTERS_KEY);
        updateFailedChaptersDisplay();
    }

    // Load progress from storage
    function loadProgress() {
        try {
            const saved = localStorage.getItem(PROGRESS_KEY);
            if (saved) {
                const data = JSON.parse(saved);
                currentChapter = data.currentChapter || 1;
                downloadedChapters = data.downloadedChapters || [];
                failedChapters = data.failedChapters || [];
                endChapter = data.targetEndChapter || 20; // Default to 20 if not set
                updateProgressDisplay();
            }
        } catch (e) {
            console.warn("Could not load progress from storage:", e);
        }

        // Load failed chapters history
        const failedChaptersHistory = getFailedChaptersHistory();
        if (failedChaptersHistory.length > 0) {
            updateFailedChaptersDisplay();
        }
    }

    // Save progress to storage
    function saveProgress() {
        const data = {
            currentChapter,
            downloadedChapters,
            failedChapters,
            targetEndChapter: endChapter, // Save the target end chapter
            timestamp: Date.now()
        };
        localStorage.setItem(PROGRESS_KEY, JSON.stringify(data));
    }

    // Clear progress
    function clearProgress() {
        localStorage.removeItem(PROGRESS_KEY);
        currentChapter = 1;
        downloadedChapters = [];
        failedChapters = [];
        updateProgressDisplay();
        progressInfo.textContent = "Progress cleared. Ready to start a new download sequence.";
    }

    // Get novel info
    async function getNovelInfo() {
        const dom = document;
        const leaves = dom.baseURI.split("/");
        const novelIndex = leaves.indexOf("novel");
        const id = leaves[novelIndex + 1];
        const novelLink = document.querySelector('a[href*="/novel/"]');
        const novelTitle = novelLink ? novelLink.textContent.trim().replace(/[\/\\?%*:|"<>]/g, '-') : leaves[leaves.length - 1].split("?")[0];

        const chaptersResp = await fetch(`https://wtr-lab.com/api/chapters/${id}`, { credentials: "include" });
        const chaptersJson = await chaptersResp.json();
        const chapters = chaptersJson.chapters;

        return { id, title: novelTitle, chapters };
    }

    // Fetch chapter content with error handling
    async function fetchChapterContent(order, novelId) {
        try {
            const language = 'en'; // Default to English, can be determined from URL
            const formData = { translate: "ai", language, raw_id: novelId, chapter_no: order, retry: false, force_retry: false };
            const res = await fetch("https://wtr-lab.com/api/reader/get", {
                method: "POST",
                headers: { "Content-Type": "application/json;charset=UTF-8" },
                body: JSON.stringify(formData),
                credentials: "include"
            });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const json = await res.json();

            // Check if the required data structure exists
            if (!json || !json.data || !json.data.data) {
                throw new Error(`Invalid data structure received for chapter ${order}. Missing required 'data.data' property.`);
            }

            const tempDiv = document.createElement("div");
            let imgCounter = 0;

            // Check again before accessing json.data.data properties
            if (!json.data.data.body) {
                throw new Error(`Chapter ${order} body is missing or inaccessible`);
            }

            json.data.data.body.forEach(el => {
                if (el === "[image]") {
                    const src = json.data.data?.images?.[imgCounter++] ?? "";
                    if (src) {
                        const img = document.createElement("img");
                        img.src = src;
                        tempDiv.appendChild(img);
                    }
                } else {
                    const pnode = document.createElement("p");
                    const wrapper = document.createElement("div");
                    wrapper.innerHTML = el;
                    pnode.textContent = wrapper.textContent;

                    for (let i = 0; i < json?.data?.data?.glossary_data?.terms?.length ?? 0; i++) {
                        const term = json.data.data.glossary_data.terms[i][0] ?? `※${i}⛬`;
                        pnode.textContent = pnode.textContent.replaceAll(`※${i}⛬`, term);
                    }
                    tempDiv.appendChild(pnode);
                }
            });

            // Get rendered text
            const getRenderedText = (container) => {
                return Array.from(container.querySelectorAll("p[data-line], p"))
                    .map(p => p.textContent)
                    .join("\n")
                    .trim();
            };

            const rawText = getRenderedText(tempDiv);
            const processedText = rawText; // Skip replacement logic for simplicity in auto-download

            return {
                html: `<h1>${order}: ${json.chapter.title}</h1><p>${processedText.replace(/\n/g,"<br>")}</p>`,
                title: json.chapter.title
            };
        } catch (error) {
            console.error(`Error fetching chapter ${order}:`, error);

            // Check if this is the specific error we want to handle differently
            if (error.message.includes("can't access property \"data\", json.data is undefined") ||
                error.message.includes("Missing required 'data.data' property") ||
                error.message.includes("Chapter") && error.message.includes("body is missing or inaccessible")) {
                // This is the specific error that should trigger the special handling
                throw new Error(`Failed to fetch chapter ${order}: ${error.message}`);
            }

            throw new Error(`Failed to fetch chapter ${order}: ${error.message}`);
        }
    }

    // Ensure JSZip is available
    async function ensureJSZip() { 
        if (window.JSZip) return window.JSZip; 
        return new Promise((res, rej) => { 
            const s = document.createElement("script"); 
            s.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"; 
            s.onload = () => res(window.JSZip); 
            s.onerror = rej; 
            document.head.appendChild(s); 
        }); 
    }

    // Format chapter number with leading zeros
    function formatChapterNumber(number) {
        return String(number).padStart(4, '0');
    }

    // Generate EPUB filename with chapter range
    function generateFilename(novelTitle, startChapterNum, endChapterNum) {
        const startFormatted = formatChapterNumber(startChapterNum);
        const endFormatted = formatChapterNumber(endChapterNum);
        return `${startFormatted}-${endFormatted} ${novelTitle}.epub`;
    }

    // Create EPUB from chapter content
    async function createEPUB(novelTitle, allContent, chapterOrders, startNum, endNum) {
        await ensureJSZip();
        const zip = new JSZip();
        
        // Add mimetype file (must be first and uncompressed)
        zip.file("mimetype", "application/epub+zip", { compression: "STORE" });
        
        const metaInf = zip.folder("META-INF");
        const oebps = zip.folder("OEBPS");
        
        // Create container.xml
        metaInf.file("container.xml", `<?xml version="1.0"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`);

        // Generate manifest and spine items
        const manifestItems = chapterOrders.map(num => {
            const formattedNum = formatChapterNumber(num);
            return `<item id="ch${formattedNum}" href="ch${formattedNum}.xhtml" media-type="application/xhtml+xml"/>`;
        }).join("\n");
        
        const spineItems = chapterOrders.map(num => {
            const formattedNum = formatChapterNumber(num);
            return `<itemref idref="ch${formattedNum}"/>`;
        }).join("\n");

        // Create content.opf
        const startFormatted = formatChapterNumber(startNum);
        const endFormatted = formatChapterNumber(endNum);
        const epubTitle = `${startFormatted}-${endFormatted} ${novelTitle}`;
        
        oebps.file("content.opf", `<?xml version="1.0" encoding="utf-8"?>
<package version="3.0" xmlns="http://www.idpf.org/2007/opf" unique-identifier="BookId">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:title>${escapeXml(epubTitle)}</dc:title>
    <dc:creator>${escapeXml("WTRLAB")}</dc:creator>
    <dc:language>en</dc:language>
    <dc:identifier id="BookId">urn:uuid:${crypto.randomUUID()}</dc:identifier>
  </metadata>
  <manifest>
    ${manifestItems}
  </manifest>
  <spine>
    ${spineItems}
  </spine>
</package>`);

        // Add chapters to the EPUB
        allContent.forEach((html, idx) => {
            const order = chapterOrders[idx];
            const formattedOrder = formatChapterNumber(order);
            oebps.file(`ch${formattedOrder}.xhtml`, `<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml">
  <head><title>Chapter ${order}</title></head>
  <body>${html}</body>
</html>`);
        });

        // Generate the EPUB file
        const blob = await zip.generateAsync({ type: "blob" });
        return blob;
    }

    // Helper function to escape XML
    function escapeXml(str) {
        return (str+"").replace(/[<>&'"]/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;',"'":'&apos;','"':'&quot;'})[c]);
    }

    // Function to resume download from a specific chapter
    async function resumeDownloadFromChapter(startNum, endNum) {
        if (isDownloading) {
            alert("Download is already in progress!");
            return;
        }

        // Clear previous progress display
        chapterList.innerHTML = '';

        // Start the download from the specified chapter
        downloadChapters(startNum, endNum);
    }

    // Function to resume download from last position to target end chapter
    async function resumeFromLastPosition() {
        if (isDownloading) {
            alert("Download is already in progress!");
            return;
        }

        // Load progress to get current and target end chapter
        loadProgress();

        // Clear previous progress display
        chapterList.innerHTML = '';

        // Start download from current chapter to target end chapter
        downloadChapters(currentChapter, endChapter);
    }

    // Function to detect if a captcha or other blocking element is present
    function isCaptchaPresent() {
        // Look for common captcha elements
        const captchaIndicators = [
            'iframe[src*="captcha"]',
            'iframe[src*="recaptcha"]',
            'div[class*="captcha"]',
            'div[class*="recaptcha"]',
            '[id*="captcha"]',
            '[id*="recaptcha"]',
            '.g-recaptcha',
            '.h-captcha',
            'iframe[src*="hcaptcha"]',
            'div[style*="opacity: 1"]', // Common for overlays
            'form[action*="captcha"]',
            '.verify-modal',
            '.challenge-container'
        ];

        for (const selector of captchaIndicators) {
            const element = document.querySelector(selector);
            if (element && element.offsetParent !== null) { // Check if element is visible
                console.log("Captcha or blocking element detected:", selector);
                return true;
            }
        }

        // Additional check for common blocking scenarios
        const body = document.body;
        const html = document.documentElement;

        // Check if the page is blocked by a modal overlay
        const overlays = document.querySelectorAll('div[style*="position: fixed"], div[style*="position:absolute"]');
        for (const overlay of overlays) {
            const style = window.getComputedStyle(overlay);
            if (style.zIndex && parseInt(style.zIndex) > 1000 &&
                overlay.offsetHeight / window.innerHeight > 0.8) {
                return true;
            }
        }

        return false;
    }

    // Function to refresh the page after a delay
    function refreshPageWithDelay(delayMs = 2000) {
        console.log(`Page will refresh in ${delayMs}ms to handle captcha/verification...`);
        setTimeout(() => {
            window.location.reload();
        }, delayMs);
    }

    // Function to handle blocking elements like captchas
    async function handleBlockingElements(novelTitle, allContent, chapterOrders, startNum, downloadCompleteCallback) {
        if (isCaptchaPresent()) {
            // Stop any ongoing downloads
            isDownloading = false;

            if (allContent && chapterOrders && allContent.length > 0) {
                // Generate EPUB with successfully downloaded chapters before refreshing
                updateProgressInfo(`Captcha detected. Creating EPUB with ${allContent.length} successfully downloaded chapters before refreshing page...`);

                // For the filename, use the actual range of successfully downloaded chapters
                const actualStart = chapterOrders.length > 0 ? Math.min(...chapterOrders) : startNum;
                const actualEnd = chapterOrders.length > 0 ? Math.max(...chapterOrders) : startNum;
                const filename = generateFilename(novelTitle, actualStart, actualEnd);
                const epubBlob = await createEPUB(novelTitle, allContent, chapterOrders, actualStart, actualEnd);

                downloadBlob(epubBlob, filename);

                updateProgressInfo(`Created EPUB with ${allContent.length} chapters. Refreshing page to resolve captcha...`);
            } else {
                updateProgressInfo(`Captcha detected. No successful downloads to save. Refreshing page to resolve...`);
            }

            saveProgress();

            // Refresh the page to handle the captcha
            setTimeout(() => {
                window.location.reload();
            }, 1000); // Shorter delay for captcha

            if (downloadCompleteCallback) {
                downloadCompleteCallback(); // Call the callback to exit the download function
            }

            return true; // Indicate that a blocking element was handled
        }
        return false; // No blocking elements found
    }

    // Download blob as file
    function downloadBlob(blob, filename) {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    }

    // Main download function
    async function downloadChapters(startNum, endNum) {
        isDownloading = true;
        currentChapter = startNum;
        endChapter = endNum; // Update the global endChapter to the target

        const { id: novelId, title: novelTitle, chapters } = await getNovelInfo();

        const allContent = [];
        const chapterOrders = [];
        const failedDownloads = [];
        const totalCount = endNum - startNum + 1; // Total number of chapters to download

        updateProgressInfo(`Starting download of chapters ${startNum} to ${endNum}...`);

        for (let chapterNum = startNum; chapterNum <= endNum; chapterNum++) {
            if (!isDownloading) break; // Check if download was stopped

            // Check for captchas or blocking elements before downloading each chapter
            if (await handleBlockingElements(novelTitle, allContent, chapterOrders, startNum, () => {})) {
                return; // Exit if captcha was detected and handled
            }

            const currentProgress = chapterNum - startNum + 1;
            chapterList.innerHTML += `<div style="margin: 2px 0; padding: 5px; background: #e3f2fd; border-radius: 3px;">Downloading chapter ${chapterNum}... (${currentProgress}/${totalCount})</div>`;
            chapterList.scrollTop = chapterList.scrollHeight;

            try {
                const { html, title } = await fetchChapterContent(chapterNum, novelId);
                allContent.push(html);
                chapterOrders.push(chapterNum);

                downloadedChapters.push(chapterNum);
                updateProgressInfo(`Successfully downloaded chapter ${chapterNum}. Progress: ${currentProgress}/${totalCount}`);

                // Add to progress display
                const lastItem = chapterList.lastChild;
                lastItem.innerHTML = `<span style="color: green;">✓ Chapter ${chapterNum} downloaded (${currentProgress}/${totalCount})</span>`;

            } catch (error) {
                console.error(`Download error at chapter ${chapterNum}:`, error);

                // For ANY error (captcha or other), stop download, create EPUB with successful chapters, and refresh page
                failedDownloads.push(chapterNum);
                failedChapters.push(chapterNum);

                // Add failed chapter to history
                addFailedChapter(novelId, novelTitle, chapterNum, error.message);

                // Update UI
                const lastItem = chapterList.lastChild;
                lastItem.innerHTML = `<span style="color: red;">✗ Chapter ${chapterNum} failed: ${error.message}</span>`;

                // Stop further downloads immediately
                isDownloading = false;

                // Create EPUB with successful chapters in the background
                (async () => {
                    if (allContent.length > 0) {
                        // Generate EPUB with successfully downloaded chapters before refreshing
                        updateProgressInfo(`Error downloading chapter ${chapterNum}. Creating EPUB with ${allContent.length} successfully downloaded chapters before refreshing page...`);

                        try {
                            // For the filename, use the actual range of successfully downloaded chapters
                            const actualStart = chapterOrders.length > 0 ? Math.min(...chapterOrders) : startNum;
                            const actualEnd = chapterOrders.length > 0 ? Math.max(...chapterOrders) : startNum;
                            const filename = generateFilename(novelTitle, actualStart, actualEnd);
                            const epubBlob = await createEPUB(novelTitle, allContent, chapterOrders, actualStart, actualEnd);

                            downloadBlob(epubBlob, filename);

                            updateProgressInfo(`Created EPUB with ${allContent.length} chapters. Refreshing page in 2 seconds...`);
                        } catch (epubError) {
                            console.error('Error creating EPUB:', epubError);
                            updateProgressInfo(`Error creating EPUB: ${epubError.message}. Refreshing page in 2 seconds...`);
                        }
                    } else {
                        updateProgressInfo(`Error downloading chapter ${chapterNum}. No successful downloads to save. Refreshing page in 2 seconds...`);
                    }

                    saveProgress();

                    // Force refresh after a delay to ensure page reload happens even if other operations are stuck
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                })();

                return; // Exit the download function immediately
            }

            // Update currentChapter to track progress
            currentChapter = chapterNum + 1;

            // Delay between chapters with captcha check
            if (chapterNum < endNum && isDownloading) { // Don't delay after the last chapter
                // Instead of a simple delay, check for captchas periodically during the delay
                const delayInterval = Math.min(delayTime, 1000); // Check every second or less
                let remainingDelay = delayTime;

                while (remainingDelay > 0 && isDownloading) {
                    if (await handleBlockingElements(novelTitle, allContent, chapterOrders, startNum, () => {})) {
                        return; // Exit if captcha was detected and handled
                    }

                    const sleepTime = Math.min(delayInterval, remainingDelay);
                    await new Promise(r => setTimeout(r, sleepTime));
                    remainingDelay -= sleepTime;
                }
            }
        }

        if (allContent.length > 0) {
            // Create and download EPUB
            updateProgressInfo(`Creating EPUB file with ${allContent.length} chapters...`);

            const filename = generateFilename(novelTitle, startNum, endNum);
            const epubBlob = await createEPUB(novelTitle, allContent, chapterOrders, startNum, endNum);

            downloadBlob(epubBlob, filename);

            updateProgressInfo(`All chapters downloaded! EPUB file created: ${filename}`);
        } else if (failedDownloads.length > 0) {
            updateProgressInfo(`Download process completed with ${failedDownloads.length} failed chapter(s).`);
        }

        isDownloading = false;
        saveProgress();
    }

    // Update progress information display
    function updateProgressInfo(text) {
        progressInfo.textContent = text;
    }

    // Update the progress display
    function updateProgressDisplay() {
        const dlCount = downloadedChapters.length;
        const failCount = failedChapters.length;
        const status = `Downloaded: ${dlCount}, Failed: ${failCount}`;

        if (chapterList.querySelector('div') && chapterList.querySelector('div').textContent === 'No downloads in progress') {
            // Only update if the list is empty
            if (dlCount > 0 || failCount > 0) {
                chapterList.innerHTML = '';
            }
        }

        // Update the target chapter display
        const targetChapterDisplay = document.getElementById("targetChapterDisplay");
        if (targetChapterDisplay) {
            targetChapterDisplay.textContent = endChapter;
        }
    }

    // Update the failed chapters display
    function updateFailedChaptersDisplay() {
        const failedChapters = getFailedChaptersHistory();
        const failedChapterList = document.getElementById("failedChapterList");
        const resumeFailedSection = document.getElementById("resumeFailedSection");

        if (failedChapters.length > 0) {
            // Clear the list and add failed chapter items
            failedChapterList.innerHTML = '';
            failedChapters.forEach((item, index) => {
                const chapterItem = document.createElement("div");
                chapterItem.style.cssText = "margin: 5px 0; padding: 8px; background: #ffebee; border: 1px solid #ffcdd2; border-radius: 4px;";

                const dateOptions = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
                const firstFailed = new Date(item.firstFailed).toLocaleString(undefined, dateOptions);
                const lastAttempt = new Date(item.lastAttempt).toLocaleString(undefined, dateOptions);

                chapterItem.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <strong>Ch. ${item.chapterNum}</strong> - ${item.errorMessage}
                        </div>
                        <div style="font-size: 12px; color: #666;">
                            <div>Attempts: ${item.retryCount}</div>
                        </div>
                    </div>
                    <div style="font-size: 11px; color: #888; margin-top: 3px;">
                        First failed: ${firstFailed} | Last attempt: ${lastAttempt}
                    </div>
                    <div style="margin-top: 5px;">
                        <button class="retry-btn" data-index="${index}" style="background: #4CAF50; color: white; border: none; padding: 4px 8px; border-radius: 3px; cursor: pointer; font-size: 11px; margin-right: 5px;">Retry</button>
                        <button class="remove-btn" data-novel-id="${item.novelId}" data-chapter-num="${item.chapterNum}" style="background: #f44336; color: white; border: none; padding: 4px 8px; border-radius: 3px; cursor: pointer; font-size: 11px;">Remove</button>
                    </div>
                `;
                failedChapterList.appendChild(chapterItem);
            });

            // Show resume button if we have failed chapters
            resumeFailedSection.style.display = "block";

            // Add event listeners to the retry and remove buttons
            document.querySelectorAll('.retry-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const index = e.target.getAttribute('data-index');
                    const failedChapters = getFailedChaptersHistory();
                    const item = failedChapters[index];
                    if (item) {
                        resumeDownloadFromChapter(item.chapterNum, item.chapterNum);
                    }
                });
            });

            document.querySelectorAll('.remove-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const novelId = e.target.getAttribute('data-novel-id');
                    const chapterNum = parseInt(e.target.getAttribute('data-chapter-num'));
                    removeFailedChapter(novelId, chapterNum);
                });
            });
        } else {
            // When there are no failed chapters, just show the "no failed chapters" message
            failedChapterList.innerHTML = '<div id="noFailedChapters">No failed chapters to show</div>';
            resumeFailedSection.style.display = "none";
        }
    }

    // Event listeners
    startDownloadBtn.addEventListener("click", async () => {
        if (isDownloading) {
            alert("Download is already in progress!");
            return;
        }

        const startNum = parseInt(startChapterInput.value) || currentChapter;
        const endNum = parseInt(endChapterInput.value);
        delayTime = parseInt(delayTimeInput.value) || DELAY_BETWEEN_CHAPTERS;

        if (isNaN(startNum) || startNum < 1) {
            alert("Please enter a valid starting chapter number (1 or higher)");
            return;
        }

        if (isNaN(endNum) || endNum < startNum) {
            alert(`Please enter a valid ending chapter number (must be >= starting chapter ${startNum})`);
            return;
        }

        // Update the target end chapter
        endChapter = endNum;

        // Clear previous progress display
        chapterList.innerHTML = '';

        downloadChapters(startNum, endNum);
    });

    stopDownloadBtn.addEventListener("click", () => {
        isDownloading = false;
        updateProgressInfo("Download stopped by user.");
        saveProgress();
    });

    clearProgressBtn.addEventListener("click", clearProgress);

    // Add event listener for clear failed history button
    const clearFailedHistoryBtn = document.getElementById("clearFailedHistoryBtn");
    clearFailedHistoryBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to clear all failed chapter history?")) {
            clearFailedChaptersHistory();
        }
    });

    // Add event listener for resume failed button
    const resumeFailedBtn = document.getElementById("resumeFailedBtn");
    resumeFailedBtn.addEventListener("click", async () => {
        const failedChapters = getFailedChaptersHistory();
        if (failedChapters.length > 0) {
            // Get the novel info
            const { id: novelId, title: novelTitle } = await getNovelInfo();

            // Get the minimum and maximum failed chapter numbers for this novel
            const novelFailedChapters = failedChapters.filter(item => item.novelId === novelId);
            if (novelFailedChapters.length > 0) {
                const chapterNumbers = novelFailedChapters.map(item => item.chapterNum);
                const startChapter = Math.min(...chapterNumbers);
                const endChapter = Math.max(...chapterNumbers);

                // Start downloading from the failed chapters
                resumeDownloadFromChapter(startChapter, endChapter);
            }
        }
    });

    // Add event listener for resume from last position button
    const resumeFromLastBtn = document.getElementById("resumeFromLastBtn");
    resumeFromLastBtn.addEventListener("click", () => {
        resumeFromLastPosition();
    });

    // Load saved progress on startup
    loadProgress();

    // Update the target chapter display after loading progress
    updateProgressDisplay();

    // Function to handle blocking elements like captchas when not in download context
    function handleBlockingElementsGlobal() {
        if (isCaptchaPresent()) {
            // Stop any ongoing downloads
            isDownloading = false;

            // Update progress display
            updateProgressInfo("Captcha detected. Refreshing page to resolve...");

            // Refresh the page to handle the captcha
            refreshPageWithDelay(1000); // Shorter delay for captcha

            return true; // Indicate that a blocking element was handled
        }
        return false; // No blocking elements found
    }

    // Set up periodic captcha check when not downloading
    setInterval(() => {
        if (!isDownloading) {
            handleBlockingElementsGlobal();
        }
    }, 5000); // Check every 5 seconds when not downloading

    console.log("WTR-LAB Auto Chapter Downloader is ready!");
})();