// ==UserScript==
// @name         Valley Radiology Imaging - Images Retrieve - Downloader
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Download medical images from PACS viewer, organized by series with configurable naming
// @author       T J
// @match        https://www.myradiologyconnectportal.com/Exam*
// @match        https://www.myradiologyconnectportal.com/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559184/Valley%20Radiology%20Imaging%20-%20Images%20Retrieve%20-%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/559184/Valley%20Radiology%20Imaging%20-%20Images%20Retrieve%20-%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * Radio Images Retrieve Script
     *
     * This script downloads medical images from a PACS viewer, organizing them by series.
     *
     * CONFIGURATION:
     * - FILENAME_PATTERN: Customize how downloaded files are named
     *   Available placeholders:
     *     {series}      - Full series name (e.g., "Series_2", "Series_100")
     *     {seriesNum}   - Series number only (e.g., "2", "100")
     *     {metadata}    - Series metadata (e.g., "Localizer")
     *     {index}       - Image index within series (1, 2, 3...)
     *     {index:03d}   - Padded index (001, 002, 003...)
     *     {epwFileName} - Original EPW filename
     *
     *   Examples:
     *     "{series}_{index:03d}_{epwFileName}"  → "Series_2_001_MR.1.2.840..."
     *     "Series{seriesNum}_{metadata}_{index:03d}" → "Series2_Localizer_001"
     *     "{series}_{metadata}_{index:03d}"     → "Series_2_Localizer_001"
     */

    // Configuration: Customize filename pattern here
    const FILENAME_PATTERN = "{series}_{index:03d}_{epwFileName}";

    // STEP 1: Expand all toggles
    function expandAllImageToggles() {
        const toggles = document.querySelectorAll('a.menu-icon');
        console.log(`📂 Opening ${toggles.length} toggle menus...`);
        updateStatusBar(`Expanding ${toggles.length} image series...`, 'info');

        toggles.forEach((toggle, i) => {
            setTimeout(() => toggle.click(), i * 100);
        });

        return new Promise(resolve => {
            setTimeout(() => {
                console.log('✅ All toggles opened!');
                updateStatusBar(`All ${toggles.length} series expanded`, 'success');
                resolve();
            }, toggles.length * 100 + 1000);
        });
    }

    // STEP 2: Download with stop control
    let shouldStop = false;
    window.stopDownload = () => {
        shouldStop = true;
        isDownloading = false;
        console.log('🛑 Stopping after current batch...');
        updateStatusBar('Stopping...', 'warning');

        // Reset button states
        const downloadButton = document.getElementById('radio-download-trigger-btn');
        const stopButton = document.getElementById('radio-stop-trigger-btn');
        if (downloadButton) {
            downloadButton.disabled = false;
            downloadButton.innerHTML = '📥 Download Images';
            downloadButton.style.background = '#4CAF50';
        }
        if (stopButton) {
            stopButton.style.display = 'none';
            stopButton.disabled = false;
            stopButton.innerHTML = '🛑 Stop Download';
            stopButton.style.background = '#f44336';
        }
    };

    // Status Bar Management
    let statusBar = null;
    let statusBarProgress = null;
    let statusBarText = null;
    let statusBarErrors = null;
    let errorList = [];

    function createStatusBar() {
        if (document.getElementById('radio-status-bar')) {
            return;
        }

        const bar = document.createElement('div');
        bar.id = 'radio-status-bar';
        bar.style.cssText = `
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: #2c3e50;
            color: white;
            padding: 15px 20px;
            z-index: 10001;
            box-shadow: 0 -2px 10px rgba(0,0,0,0.3);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 14px;
            display: none;
        `;

        // Progress bar container
        const progressContainer = document.createElement('div');
        progressContainer.style.cssText = `
            margin-bottom: 10px;
        `;

        const progressBar = document.createElement('div');
        progressBar.id = 'radio-status-progress';
        progressBar.style.cssText = `
            width: 100%;
            height: 25px;
            background: #34495e;
            border-radius: 12px;
            overflow: hidden;
            position: relative;
        `;

        const progressFill = document.createElement('div');
        progressFill.id = 'radio-status-progress-fill';
        progressFill.style.cssText = `
            height: 100%;
            width: 0%;
            background: linear-gradient(90deg, #4CAF50, #45a049);
            transition: width 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 12px;
        `;

        progressBar.appendChild(progressFill);
        progressContainer.appendChild(progressBar);

        // Status text
        const statusText = document.createElement('div');
        statusText.id = 'radio-status-text';
        statusText.style.cssText = `
            margin-bottom: 8px;
            font-weight: 500;
        `;

        // Error container
        const errorContainer = document.createElement('div');
        errorContainer.id = 'radio-status-errors';
        errorContainer.style.cssText = `
            max-height: 100px;
            overflow-y: auto;
            margin-top: 8px;
            padding-top: 8px;
            border-top: 1px solid #34495e;
            display: none;
        `;

        bar.appendChild(progressContainer);
        bar.appendChild(statusText);
        bar.appendChild(errorContainer);

        document.body.appendChild(bar);
        statusBar = bar;
        statusBarProgress = progressFill;
        statusBarText = statusText;
        statusBarErrors = errorContainer;
    }

    function showStatusBar() {
        if (statusBar) {
            statusBar.style.display = 'block';
        }
    }

    function hideStatusBar() {
        if (statusBar) {
            statusBar.style.display = 'none';
        }
    }

    function updateStatusBar(message, type = 'info') {
        if (!statusBarText) return;

        const colors = {
            info: '#3498db',
            success: '#2ecc71',
            warning: '#f39c12',
            error: '#e74c3c'
        };

        statusBarText.innerHTML = `<span style="color: ${colors[type] || colors.info}">●</span> ${message}`;
    }

    function updateProgress(current, total) {
        if (!statusBarProgress) return;

        const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
        statusBarProgress.style.width = `${percentage}%`;
        statusBarProgress.textContent = `${current} / ${total} (${percentage}%)`;
    }

    function addError(message) {
        if (!statusBarErrors) return;

        errorList.push({
            time: new Date().toLocaleTimeString(),
            message: message
        });

        // Keep only last 10 errors
        if (errorList.length > 10) {
            errorList.shift();
        }

        // Update error display
        statusBarErrors.innerHTML = errorList.map(err =>
            `<div style="color: #e74c3c; font-size: 12px; margin-bottom: 4px;">
                <span style="color: #95a5a6;">[${err.time}]</span> ${err.message}
            </div>`
        ).join('');

        statusBarErrors.style.display = errorList.length > 0 ? 'block' : 'none';
    }

    function clearErrors() {
        errorList = [];
        if (statusBarErrors) {
            statusBarErrors.innerHTML = '';
            statusBarErrors.style.display = 'none';
        }
    }

    // Helper function to extract series information from a DOM element
    function getSeriesInfo(imageElement) {
        // Find the parent series container
        const seriesContainer = imageElement.closest('.series');
        if (!seriesContainer) {
            return { series: 'Unknown', seriesNum: '0', metadata: '' };
        }

        // Find the series header info
        const infoWrapper = seriesContainer.querySelector('.info-wrapper');
        if (!infoWrapper) {
            return { series: 'Unknown', seriesNum: '0', metadata: '' };
        }

        // Extract series number (e.g., "Series 2", "Series 100")
        const seriesText = infoWrapper.querySelector('.col-xs-6.info span.text-white');
        let series = 'Unknown';
        let seriesNum = '0';

        if (seriesText) {
            series = seriesText.textContent.trim();
            // Extract just the number part
            const numMatch = series.match(/Series\s+(\d+)/i);
            if (numMatch) {
                seriesNum = numMatch[1];
            }
        }

        // Extract metadata (e.g., "Localizer", or the date range)
        const firstInfoCol = infoWrapper.querySelector('.col-xs-6.info');
        let metadata = '';

        if (firstInfoCol) {
            // Get all text content and split by lines
            const fullText = firstInfoCol.textContent || '';
            const lines = fullText.split('\n').map(line => line.trim()).filter(line => line);

            // Find the line that contains "Series" to identify where metadata starts
            let seriesLineIndex = -1;
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].includes('Series')) {
                    seriesLineIndex = i;
                    break;
                }
            }

            // Metadata is typically the next non-empty line after the series line
            if (seriesLineIndex >= 0 && seriesLineIndex + 1 < lines.length) {
                const potentialMetadata = lines[seriesLineIndex + 1];
                // Skip if it's just a number or looks like a date range pattern
                if (potentialMetadata &&
                    !potentialMetadata.match(/^\d+$/) &&
                    !potentialMetadata.match(/^\d{4}\/\d+\/\d+/)) {
                    metadata = potentialMetadata;
                }
            }

            // Alternative: look for text nodes that come after the span containing "Series"
            if (!metadata) {
                const seriesSpan = firstInfoCol.querySelector('span.text-white');
                if (seriesSpan && seriesSpan.nextSibling) {
                    // Check siblings after the span
                    let node = seriesSpan.nextSibling;
                    while (node) {
                        if (node.nodeType === 3) { // Text node
                            const text = node.textContent.trim();
                            if (text && !text.match(/^\d+$/) && !text.match(/^\d{4}\/\d+\/\d+/)) {
                                metadata = text;
                                break;
                            }
                        }
                        node = node.nextSibling;
                    }
                }
            }
        }

        // Clean up metadata (remove extra whitespace, newlines, sanitize for filename)
        metadata = metadata.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');

        return { series, seriesNum, metadata };
    }

    // Helper function to generate filename from pattern
    function generateFileName(pattern, data) {
        let fileName = pattern;

        // Replace placeholders
        fileName = fileName.replace(/{series}/g, data.series.replace(/\s+/g, '_'));
        fileName = fileName.replace(/{seriesNum}/g, data.seriesNum);
        fileName = fileName.replace(/{metadata}/g, data.metadata || '');
        fileName = fileName.replace(/{epwFileName}/g, data.epwFileName);

        // Handle formatted index (e.g., {index:03d})
        const indexMatch = fileName.match(/{index:(\d+)d}/);
        if (indexMatch) {
            const padding = parseInt(indexMatch[1]);
            fileName = fileName.replace(/{index:\d+d}/, String(data.index).padStart(padding, '0'));
        } else {
            fileName = fileName.replace(/{index}/g, String(data.index));
        }

        // Clean up any double underscores or trailing underscores
        fileName = fileName.replace(/_+/g, '_').replace(/^_|_$/g, '');

        return fileName;
    }

    async function downloadHighResImagesFast() {
        // Initialize status bar
        createStatusBar();
        showStatusBar();
        clearErrors();
        updateStatusBar('Initializing...', 'info');
        updateProgress(0, 100);

        // Find all series containers
        const seriesContainers = document.querySelectorAll('.series');
        console.log(`Found ${seriesContainers.length} series`);
        updateStatusBar(`Found ${seriesContainers.length} series. Analyzing images...`, 'info');

        // Collect all images grouped by series
        const allImageData = [];
        let globalIndex = 0;

        seriesContainers.forEach((seriesContainer, seriesIdx) => {
            const imageLinks = seriesContainer.querySelectorAll('a.bottomhalf[onclick*="DisplayQuickView"]');
            const seriesInfo = getSeriesInfo(seriesContainer.querySelector('a.bottomhalf[onclick*="DisplayQuickView"]') || seriesContainer);

            console.log(`📁 Series ${seriesIdx + 1}: ${seriesInfo.series} (${imageLinks.length} images)${seriesInfo.metadata ? ` - ${seriesInfo.metadata}` : ''}`);

            imageLinks.forEach((link, localIdx) => {
                const onclickAttr = link.getAttribute('onclick');
                const match = onclickAttr.match(/DisplayQuickView\('([^']+)',\s*'([^']+)',\s*'([^']+)'\)/);
                if (!match) return;

                const [, epwFileName, epwFrame, imgDataSrc] = match;

                // Get series info for this specific image
                const imgSeriesInfo = getSeriesInfo(link);

                // Generate filename using the pattern
                const fileName = generateFileName(FILENAME_PATTERN, {
                    ...imgSeriesInfo,
                    index: localIdx + 1, // 1-based index within series
                    epwFileName
                });

                allImageData.push({
                    globalIndex: globalIndex++,
                    seriesIndex: localIdx + 1,
                    seriesInfo: imgSeriesInfo,
                    fileName,
                    imgDataSrc,
                    epwFileName
                });
            });
        });

        console.log(`\n📊 Total: ${allImageData.length} images across ${seriesContainers.length} series`);
        console.log(`📝 Filename pattern: ${FILENAME_PATTERN}`);
        console.log('💡 To stop anytime, run: stopDownload()\n');

        const imageData = allImageData;
        const totalImages = imageData.length;

        if (totalImages === 0) {
            updateStatusBar('No images found to download', 'warning');
            setTimeout(() => hideStatusBar(), 3000);
            return;
        }

        updateStatusBar(`Starting download: ${totalImages} images across ${seriesContainers.length} series`, 'info');
        updateProgress(0, totalImages);

        let downloaded = 0;
        let failed = 0;
        const batchSize = 5;
        let currentSeries = '';

        for (let batchStart = 0; batchStart < imageData.length; batchStart += batchSize) {
            if (shouldStop) {
                console.log(`\n⏹️  Stopped at image ${batchStart}/${imageData.length}`);
                console.log(`✅ Downloaded: ${downloaded}, ❌ Failed: ${failed}, ⏭️ Skipped: ${imageData.length - batchStart}`);
                updateStatusBar(`Stopped: ${downloaded} downloaded, ${failed} failed`, 'warning');
                shouldStop = false;
                isDownloading = false;
                // Reset button states
                const downloadButton = document.getElementById('radio-download-trigger-btn');
                const stopButton = document.getElementById('radio-stop-trigger-btn');
                if (downloadButton) {
                    downloadButton.disabled = false;
                    downloadButton.innerHTML = '📥 Download Images';
                    downloadButton.style.background = '#4CAF50';
                }
                if (stopButton) {
                    stopButton.style.display = 'none';
                }
                setTimeout(() => hideStatusBar(), 5000);
                return;
            }

            const batch = imageData.slice(batchStart, batchStart + batchSize);
            const batchNum = Math.floor(batchStart / batchSize) + 1;
            const totalBatches = Math.ceil(imageData.length / batchSize);

            // Show series info for first item in batch
            const firstItem = batch[0];
            const seriesLabel = firstItem ? `${firstItem.seriesInfo.series}` : '';
            if (seriesLabel && seriesLabel !== currentSeries) {
                currentSeries = seriesLabel;
                updateStatusBar(`Processing ${currentSeries} - Batch ${batchNum}/${totalBatches}`, 'info');
            }
            console.log(`📦 Batch ${batchNum}/${totalBatches}${seriesLabel ? ` (${seriesLabel})` : ''}`);

            const promises = batch.map(async (data) => {
                try {
                    const popup = window.open('/PACS/QuickPACSView', `_QV_${data.globalIndex}`,
                        'toolbar=no,status=no,menubar=no,width=850,height=500');
                    if (!popup) throw new Error('Popup blocked');

                    await new Promise((resolve, reject) => {
                        const timeout = setTimeout(() => reject(new Error('Timeout')), 8000);

                        popup.addEventListener('load', async () => {
                            try {
                                const canvas = popup.document.getElementById('QuickViewCanvas');
                                if (!canvas) throw new Error('Canvas not found');

                                const ctx = canvas.getContext('2d');
                                const img = new Image();

                                img.onload = async () => {
                                    ctx.drawImage(img, 0, 0);
                                    await new Promise(r => setTimeout(r, 100));

                                    canvas.toBlob((blob) => {
                                        if (blob) {
                                            const url = URL.createObjectURL(blob);
                                            const a = document.createElement('a');
                                            a.href = url;
                                            a.download = `${data.fileName}.png`;
                                            a.click();
                                            setTimeout(() => URL.revokeObjectURL(url), 100);
                                            downloaded++;
                                            const seriesLabel = `${data.seriesInfo.series}`;
                                            console.log(`✅ ${downloaded}/${imageData.length} - ${seriesLabel} #${data.seriesIndex}`);

                                            // Update status bar
                                            updateProgress(downloaded, totalImages);
                                            updateStatusBar(`Downloaded ${downloaded}/${totalImages} - ${seriesLabel} #${data.seriesIndex}`, 'success');
                                        }
                                        clearTimeout(timeout);
                                        popup.close();
                                        resolve();
                                    }, 'image/png');
                                };

                                img.onerror = () => {
                                    clearTimeout(timeout);
                                    popup.close();
                                    reject(new Error('Image failed'));
                                };

                                img.src = '/PACS/Image/' + data.imgDataSrc;
                            } catch (e) {
                                clearTimeout(timeout);
                                popup.close();
                                reject(e);
                            }
                        }, { once: true });
                    });
                } catch (e) {
                    const errorMsg = `${data.fileName} (${data.seriesInfo.series}): ${e.message || 'Unknown error'}`;
                    console.error(`❌ ${errorMsg}`);
                    failed++;
                    addError(errorMsg);
                    updateStatusBar(`Error: ${failed} failed, ${downloaded} downloaded`, 'error');
                }
            });

            await Promise.allSettled(promises);
            await new Promise(r => setTimeout(r, 1000));
        }

        console.log(`\n🎉 Complete! ✅ ${downloaded}, ❌ Failed: ${failed}`);
        shouldStop = false; // Reset for next run

        // Update final status
        if (failed === 0) {
            updateStatusBar(`Complete! All ${downloaded} images downloaded successfully`, 'success');
        } else {
            updateStatusBar(`Complete: ${downloaded} downloaded, ${failed} failed`, failed > downloaded / 2 ? 'error' : 'warning');
        }
        updateProgress(downloaded, totalImages);

        // Hide status bar after 5 seconds
        setTimeout(() => hideStatusBar(), 5000);
    }

    // Main workflow function
    async function runCompleteWorkflow() {
        console.log('🚀 Starting complete workflow...\n');
        await expandAllImageToggles();
        await new Promise(r => setTimeout(r, 1000)); // Extra wait
        await downloadHighResImagesFast();
    }

    // Expose functions to window for manual triggering
    window.downloadRadioImages = runCompleteWorkflow;
    window.expandToggles = expandAllImageToggles;
    window.downloadImages = downloadHighResImagesFast;

    // Add keyboard shortcut (Ctrl+Shift+D or Cmd+Shift+D)
    document.addEventListener('keydown', function(e) {
        // Ctrl+Shift+D (Windows/Linux) or Cmd+Shift+D (Mac)
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
            e.preventDefault();
            console.log('🎯 Keyboard shortcut triggered!');
            runCompleteWorkflow();
        }
    });

    // Track download state
    let isDownloading = false;

    // Create floating buttons (download and stop)
    function createTriggerButtons() {
        // Check if buttons already exist
        if (document.getElementById('radio-download-trigger-btn')) {
            return;
        }

        // Create container for buttons
        const container = document.createElement('div');
        container.id = 'radio-download-buttons-container';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;

        // Download button
        const downloadButton = document.createElement('button');
        downloadButton.id = 'radio-download-trigger-btn';
        downloadButton.innerHTML = '📥 Download Images';
        downloadButton.style.cssText = `
            padding: 12px 20px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
            transition: background 0.3s;
            min-width: 160px;
        `;

        downloadButton.addEventListener('mouseenter', () => {
            if (!downloadButton.disabled) {
                downloadButton.style.background = '#45a049';
            }
        });

        downloadButton.addEventListener('mouseleave', () => {
            if (!downloadButton.disabled) {
                downloadButton.style.background = '#4CAF50';
            }
        });

        downloadButton.addEventListener('click', () => {
            if (isDownloading) return;

            isDownloading = true;
            downloadButton.disabled = true;
            downloadButton.innerHTML = '⏳ Downloading...';
            downloadButton.style.background = '#999';
            stopButton.style.display = 'block';

            runCompleteWorkflow().finally(() => {
                isDownloading = false;
                downloadButton.disabled = false;
                downloadButton.innerHTML = '📥 Download Images';
                downloadButton.style.background = '#4CAF50';
                stopButton.style.display = 'none';
            });
        });

        // Stop button
        const stopButton = document.createElement('button');
        stopButton.id = 'radio-stop-trigger-btn';
        stopButton.innerHTML = '🛑 Stop Download';
        stopButton.style.cssText = `
            padding: 12px 20px;
            background: #f44336;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
            transition: background 0.3s;
            min-width: 160px;
            display: none;
        `;

        stopButton.addEventListener('mouseenter', () => {
            stopButton.style.background = '#da190b';
        });

        stopButton.addEventListener('mouseleave', () => {
            stopButton.style.background = '#f44336';
        });

        stopButton.addEventListener('click', () => {
            stopDownload();
            stopButton.innerHTML = '⏹️ Stopping...';
            stopButton.style.background = '#999';
            stopButton.disabled = true;

            // Reset button after a short delay
            setTimeout(() => {
                stopButton.innerHTML = '🛑 Stop Download';
                stopButton.style.background = '#f44336';
                stopButton.disabled = false;
                stopButton.style.display = 'none';
            }, 2000);
        });

        container.appendChild(downloadButton);
        container.appendChild(stopButton);
        document.body.appendChild(container);
    }

    // Wait for page to load, then add buttons and status bar
    function initializeUI() {
        createTriggerButtons();
        createStatusBar(); // Create status bar (hidden by default)
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeUI);
    } else {
        initializeUI();
    }

    console.log('✅ Radio Images Retrieve script loaded!');
    console.log('💡 Ways to trigger:');
    console.log('   1. Click the "📥 Download Images" button (top-right)');
    console.log('   2. Press Ctrl+Shift+D (or Cmd+Shift+D on Mac)');
    console.log('   3. Run: downloadRadioImages() in console');
    console.log('   4. Click "🛑 Stop Download" button (appears during download)');
    console.log('   5. Run: stopDownload() in console to stop current download');
})();
