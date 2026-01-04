// ==UserScript==
// @name         E-Hentai Batch Downloader
// @version      1.3.3  
// @description  Download all galleries from a search results page or single galleries on E-Hentai/ExHentai sequentially with optimized ZIP creation
// @author       luka_m
// @license      MIT 
// @match        https://e-hentai.org/*
// @match        https://exhentai.org/*
// @match        https://g.e-hentai.org/*
// @match        https://r.e-hentai.org/*
// @match        http://e-hentai.org/*
// @match        http://exhentai.org/*
// @namespace    http://ext.ccloli.com
// @supportURL   https://github.com/lukamahariel/E-Hentai-Batch-Downloader
// @connect      e-hentai.org
// @connect      exhentai.org
// @connect      exhentai55ld2wyap5juskbm67czulomrouspdacjamjeloj7ugjbsad.onion
// @connect      hath.network
// @connect      api.e-hentai.org
// @connect      *
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.xmlHttpRequest
// @grant        GM.info
// @require      https://unpkg.com/fflate@0.8.2/umd/index.js
// @downloadURL https://update.greasyfork.org/scripts/553635/E-Hentai%20Batch%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/553635/E-Hentai%20Batch%20Downloader.meta.js
// ==/UserScript==

'use strict';
console.log('[EHD Batch] E-Hentai Batch Downloader v1.3.3 running on Violentmonkey.');

// Violentmonkey compatibility
var GM = window.GM || {};
var loadSetting = function(key, init) {
  if (GM.getValue) {
    return GM.getValue(key, init);
  } else {
    return Promise.resolve(GM_getValue(key, init));
  }
};
var GM_setValue = GM.setValue || GM_setValue;
var GM_xmlhttpRequest = GM.xmlHttpRequest || GM_xmlhttpRequest;
var GM_info = GM.info || GM_info ||
  { scriptHandler: 'Violentmonkey', version: 'unknown' };

// Browser check
if (navigator.userAgent.includes('Trident')) {
  alert('Internet Explorer is not supported. Please use a modern browser.');
  throw new Error('[EHD] IE not supported.');
}

// Define ehDownloadArrow
var ehDownloadArrow = '<img src="data:image/gif;base64,R0lGODlhBQAHALMAAK6vr7OztK+urra2tkJCQsDAwEZGRrKyskdHR0FBQUhISP///wAAAAAAAAAAAAAAACH5BAEAAAsALAAAAAAFAAcAAAQUUI1FlREVpbOUSkTgbZ0CUEhBLREAOw==">';

// Detect page type
var isGalleryPage = location.pathname.startsWith('/g/');
var host = location.hostname;
if (host === 'exhentai.org') host = 'e-hentai.org';

// Global variables
var isDownloading = false, isPausing = false;
var galleries = [], currentGalleryIndex = 0;
var setting = { 'ignore-torrent': true, 'cache-enabled': true };
var imageList = [], imageData = [], retryCount = [], pageURLsList = [], imageURLsList = [];
var failedCount = 0, downloadedCount = 0, fetchCount = 0, totalCount = 0;
var galleryTitle, subTitle, category, uploader;
var statusContainer, progressBar, batchProgressBar;

// Initialize settings with cache support
function initSetting() {
  loadSetting('ehD-setting', '{}').then(data => {
    try {
      if (data && typeof data === 'string' && data.trim().startsWith('{')) {
        setting = JSON.parse(data);
      } else {
        setting = { 'ignore-torrent': true, 'cache-enabled': true };
        GM_setValue('ehD-setting', JSON.stringify(setting));
      }
      console.log('[EHD Batch] Settings loaded:', setting);
    } catch (e) {
      console.error('[EHD Batch] Error parsing settings:', e, 'Data:', data);
      setting = { 'ignore-torrent': true, 'cache-enabled': true };
      GM_setValue('ehD-setting', JSON.stringify(setting));
    }
  });
}

// Batch download for search pages
if (!isGalleryPage) {
  console.log('[EHD Batch] Detected search page:', location.href);
  var ehBatchDownloadBox = document.createElement('fieldset');
  ehBatchDownloadBox.className = 'ehD-box';
  var style = document.createElement('style');
  style.textContent = `
    .ehD-box { border: 1px solid #5C0D12; padding: 15px; margin: 15px; background: #f8f8f8; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .ehD-box legend { font-weight: bold; color: #5C0D12; font-size: 1.2em; padding: 0 10px; }
    .ehD-box .g2 { margin: 10px 0; display: flex; align-items: center; }
    .ehD-box .g2 a { cursor: pointer; color: #5C0D12; text-decoration: none; font-weight: bold; margin-left: 5px; }
    .ehD-box .g2 a:hover { text-decoration: underline; }
    .ehD-status { margin-top: 10px; }
    .ehD-status p { margin: 5px 0; font-size: 1em; color: #333; }
    .ehD-status button { margin: 5px 5px 5px 0; padding: 8px 15px; cursor: pointer; border: none; border-radius: 4px; color: white; font-weight: bold; transition: background 0.3s; }
    .ehD-status button:disabled { cursor: not-allowed; opacity: 0.5; }
    .ehD-status #ehD-pause { background: #e67e22; }
    .ehD-status #ehD-pause:hover { background: #d35400; }
    .ehD-status #ehD-resume { background: #27ae60; }
    .ehD-status #ehD-resume:hover { background: #219a52; }
    .ehD-status #ehD-cancel { background: #c0392b; }
    .ehD-status #ehD-cancel:hover { background: #a93226; }
    .ehD-status #ehD-skip { background: #2980b9; }
    .ehD-status #ehD-skip:hover { background: #2473a6; }
    .ehD-progress { margin: 10px 0; }
    .ehD-progress label { display: block; margin-bottom: 5px; font-size: 0.9em; color: #555; }
    .ehD-progress progress { width: 100%; height: 10px; border-radius: 5px; }
  `;
  ehBatchDownloadBox.appendChild(style);
  var ehBatchDownloadBoxTitle = document.createElement('legend');
  ehBatchDownloadBoxTitle.innerHTML = 'E-Hentai Batch Downloader';
  ehBatchDownloadBox.appendChild(ehBatchDownloadBoxTitle);

  var ehBatchDownloadAction = document.createElement('div');
  ehBatchDownloadAction.className = 'g2';
  ehBatchDownloadAction.innerHTML = ehDownloadArrow + ' <a>Download All Galleries in This Page</a>';
  ehBatchDownloadAction.addEventListener('click', function(event) {
    event.preventDefault();
    console.log('[EHD Batch] Batch download button clicked.');
    startBatchDownload();
  });
  ehBatchDownloadBox.appendChild(ehBatchDownloadAction);

  statusContainer = document.createElement('div');
  statusContainer.className = 'ehD-status';
  statusContainer.innerHTML = '<p id="ehD-status-text">Status: Idle</p>';

  batchProgressBar = document.createElement('div');
  batchProgressBar.className = 'ehD-progress';
  batchProgressBar.innerHTML = '<label>Batch Progress:</label><progress id="ehD-batch-progress" value="0" max="100"></progress>';
  statusContainer.appendChild(batchProgressBar);

  progressBar = document.createElement('div');
  progressBar.className = 'ehD-progress';
  progressBar.innerHTML = '<label>Current Gallery Progress:</label><progress id="ehD-progress" value="0" max="100"></progress>';
  statusContainer.appendChild(progressBar);

  ehBatchDownloadBox.appendChild(statusContainer);
  var insertPoint = document.querySelector('#searchbox, .searchnav, .itg') || document.body;
  insertPoint.parentNode.insertBefore(ehBatchDownloadBox, insertPoint);
  console.log('[EHD Batch] Batch download box inserted before:', insertPoint);

  function startBatchDownload() {
    if (isDownloading && !confirm('A download is in progress. Stop and start batch?')) return;
    isDownloading = false;
    isPausing = false;
    galleries = [];
    currentGalleryIndex = 0;

    const galleryMap = new Map();
    const selectors = [
      '.glname a',
      '.itg a',
      '.id1 a',
      '.gld a',
      'a[href*="/g/"]'
    ];
    Array.from(document.querySelectorAll(selectors.join(','))).forEach(a => {
      var match = a.href.match(/\/g\/(\d+)\/([a-f0-9]+)\//i);
      if (match) {
        const gid = parseInt(match[1]);
        if (!galleryMap.has(gid)) {
          galleryMap.set(gid, {
            gid,
            token: match[2],
            title: a.textContent.trim() || 'Untitled_' + gid
          });
        }
      }
    });
    galleries = Array.from(galleryMap.values());

    console.log('[EHD Batch] Found', galleries.length, 'unique galleries:', galleries);
    if (galleries.length === 0) {
      alert('No galleries found. Try switching to Extended or Thumbnail view mode. Check console for details.');
      console.error('[EHD Batch] No galleries found. Tried selectors:', selectors);
      updateStatus('Error: No galleries found. Try switching to Extended or Thumbnail view.');
      return;
    }

    updateStatus(`Starting sequential download for ${galleries.length} galleries`);
    updateBatchProgress();
    isDownloading = true;
    fetchGalleryMetadata(currentGalleryIndex);
  }

  function fetchGalleryMetadata(index) {
    console.log('[EHD Batch] Entering fetchGalleryMetadata for index:', index);
    if (index >= galleries.length || !isDownloading) {
      if (isDownloading) {
        console.log('[EHD Batch] All galleries processed.');
        alert('Batch download complete.');
        updateStatus('Batch download complete.');
        isDownloading = false;
      }
      return;
    }

    // Check cache first
    const cacheKey = `ehD-cache-${galleries[index].gid}`;
    loadSetting(cacheKey, null).then(cached => {
      if (cached && setting['cache-enabled']) {
        try {
          const metadata = JSON.parse(cached);
          // Validate it's actual metadata
          if (metadata.gid && metadata.gid === galleries[index].gid) {
            galleries[index].metadata = metadata;
            console.log('[EHD Batch] Loaded valid cached metadata for gallery', galleries[index].gid);
            updateStatus(`Loaded cached metadata for "${galleries[index].title}"`);
            downloadNextGallery();
            return;
          } else {
            console.warn('[EHD Batch] Cache mismatch for', galleries[index].gid, 'Expected gid:', galleries[index].gid, 'Got:', metadata.gid);
          }
        } catch (e) {
          console.warn('[EHD Batch] Invalid cache for', galleries[index].gid, ':', e);
        }
      }

      // Batch API request
      const batch = galleries.slice(index, index + API_BATCH_SIZE).map(gal => [gal.gid, gal.token]);
      console.log('[EHD Batch] Fetching metadata for', batch.length, 'galleries starting at index', index, 'Batch:', batch);
      updateStatus(`Fetching metadata for ${batch.length} galleries starting with "${galleries[index].title}"`);

      GM_xmlhttpRequest({
        method: 'POST',
        url: 'https://api.e-hentai.org/api.php',
        data: JSON.stringify({
          method: 'gdata',
          gidlist: batch,
          namespace: 1
        }),
        headers: { 
          'Content-Type': 'application/json',
          'Cookie': document.cookie  // Add session cookies for potential auth
        },
        timeout: 30000,  // 30 seconds timeout
        onprogress: function(res) {
          if (res.lengthComputable) {
            console.log('[EHD Batch] API upload progress:', res.loaded, '/', res.total);
          }
        },
        onload: function(res) {
          console.log('[EHD Batch] API response received, status:', res.status, 'Length:', res.responseText.length);
          if (!isDownloading) return;
          if (res.status !== 200) {
            console.error('[EHD Batch] API error for batch starting at', galleries[index].gid, ':', res);
            alert(`API request failed for batch starting at ${galleries[index].title}.`);
            updateStatus(`Error: API request failed for batch. Skipping.`);
            currentGalleryIndex += batch.length;
            setTimeout(() => fetchGalleryMetadata(currentGalleryIndex), 1000);
            return;
          }
          let data;
          try {
            data = JSON.parse(res.responseText);
          } catch (e) {
            console.error('[EHD Batch] Parse error for batch:', e, 'Response:', res.responseText);
            alert(`API response parsing failed for batch.`);
            updateStatus(`Error: Failed to parse API response for batch. Skipping.`);
            currentGalleryIndex += batch.length;
            setTimeout(() => fetchGalleryMetadata(currentGalleryIndex), 1000);
            return;
          }
          if (data.error) {
            const retryDelay = Math.min(120000, 1000 * Math.pow(2, retryCount[index] || 1)); // Exponential backoff
            if (data.error.includes('too many gidlist requests')) {
              console.log('[EHD Batch] Rate limit hit. Retrying after', retryDelay, 'ms.');
              updateStatus(`Rate limit hit. Retrying in ${retryDelay / 1000} seconds.`);
              setTimeout(() => fetchGalleryMetadata(index), retryDelay);
              return;
            }
            console.error('[EHD Batch] API error:', data.error);
            alert(`API error: ${data.error}`);
            updateStatus(`API error: ${data.error}. Skipping.`);
            currentGalleryIndex += batch.length;
            setTimeout(() => fetchGalleryMetadata(currentGalleryIndex), 1000);
            return;
          }
          data.gmetadata.forEach((md, i) => {
            galleries[index + i].metadata = md;
            if (setting['cache-enabled']) {
              GM_setValue(`ehD-cache-${galleries[index + i].gid}`, JSON.stringify(md));
            }
          });
          console.log('[EHD Batch] Metadata fetched for', data.gmetadata.length, 'galleries');
          updateStatus(`Metadata fetched for ${data.gmetadata.length} galleries`);
          downloadNextGallery();
        },
        ontimeout: function() {
          console.error('[EHD Batch] API request timed out for batch starting at', galleries[index].gid);
          updateStatus(`Error: API request timed out for batch starting with "${galleries[index].title}". Skipping.`);
          currentGalleryIndex += batch.length;
          setTimeout(() => fetchGalleryMetadata(currentGalleryIndex), 2000);
        },
        onerror: function(err) {
          console.error('[EHD Batch] API request error details:', err);
          if (!isDownloading) return;
          alert(`API request failed for batch.`);
          updateStatus(`Error: API request failed for batch. Skipping.`);
          currentGalleryIndex += batch.length;
          setTimeout(() => fetchGalleryMetadata(currentGalleryIndex), 1000);
        }
      });
    });
  }
}

// Gallery page logic
if (isGalleryPage) {
  console.log('[EHD Batch] Detected gallery page:', location.href);
  var ehDownloadBox = document.createElement('fieldset');
  ehDownloadBox.className = 'ehD-box';
  ehDownloadBox.appendChild(style.cloneNode(true)); // Reuse style
  var ehDownloadBoxTitle = document.createElement('legend');
  ehDownloadBoxTitle.innerHTML = 'E-Hentai Downloader';
  ehDownloadBox.appendChild(ehDownloadBoxTitle);
  var ehDownloadAction = document.createElement('div');
  ehDownloadAction.className = 'g2';
  ehDownloadAction.innerHTML = ehDownloadArrow + ' <a>Download Gallery</a>';
  ehDownloadAction.addEventListener('click', function(event) {
    event.preventDefault();
    console.log('[EHD Batch] Single gallery download initiated.');
    const match = location.href.match(/\/g\/(\d+)\/([a-f0-9]+)\//i);
    if (!match) {
      alert('Could not parse gallery ID or token.');
      return;
    }
    galleries = [{
      gid: parseInt(match[1]),
      token: match[2],
      title: document.querySelector('h1')?.textContent.trim() || 'Untitled_' + match[1]
    }];
    currentGalleryIndex = 0;
    updateStatus('Fetching metadata for single gallery');
    isDownloading = true;
    fetchGalleryMetadata(currentGalleryIndex);
  });
  ehDownloadBox.appendChild(ehDownloadAction);

  statusContainer = document.createElement('div');
  statusContainer.className = 'ehD-status';
  statusContainer.innerHTML = '<p id="ehD-status-text">Status: Idle</p>';

  progressBar = document.createElement('div');
  progressBar.className = 'ehD-progress';
  progressBar.innerHTML = '<label>Gallery Progress:</label><progress id="ehD-progress" value="0" max="100"></progress>';
  statusContainer.appendChild(progressBar);

  ehDownloadBox.appendChild(statusContainer);
  const insertPoint = document.getElementById('gd5') || document.querySelector('.gm')?.nextElementSibling || document.body.firstChild;
  document.body.insertBefore(ehDownloadBox, insertPoint);
}

function downloadNextGallery() {
  console.log('[EHD Batch] Entering downloadNextGallery, currentGalleryIndex:', currentGalleryIndex);
  if (currentGalleryIndex >= galleries.length || !isDownloading) {
    if (isDownloading) {
      console.log('[EHD Batch] All galleries downloaded.');
      alert('Batch download complete.');
      updateStatus('Batch download complete.');
      isDownloading = false;
    }
    return;
  }

  var gal = galleries[currentGalleryIndex];
  var md = gal.metadata;
  if (!md) {
    console.error('[EHD Batch] No metadata for gallery', gal.gid);
    updateStatus(`Error: No metadata for gallery ${gal.gid}. Skipping.`);
    currentGalleryIndex++;
    setTimeout(() => fetchGalleryMetadata(currentGalleryIndex), 1000);
    return;
  }

  galleryTitle = md.title;
  subTitle = md.title_jpn || '';
  category = md.category;
  uploader = md.uploader;

  if (md.filelist && Array.isArray(md.filelist)) {
    console.log('[EHD Batch] Using filelist from API for gallery', gal.gid);
    pageURLsList = md.filelist.map((f, idx) => `https://${host}/s/${f.token}/${gal.gid}-${idx + 1}`);
    totalCount = pageURLsList.length;
    updateStatus(`Using API filelist for gallery "${galleryTitle}" (${totalCount} images)`);
    continueDownloadSetup();
  } else {
    console.warn('[EHD Batch] filelist not found in metadata. Scraping gallery pages for gallery', gal.gid, 'Title:', galleryTitle || 'Unknown');
    updateStatus(`Scraping gallery pages for "${galleryTitle || 'Unknown'}"`);
    const baseGalleryUrl = `https://${host}/g/${gal.gid}/${gal.token}/`;
    pageURLsList = [];
    totalCount = 0;
    scrapeGalleryPage(0, baseGalleryUrl);
  }
}

function scrapeGalleryPage(pageNum, baseGalleryUrl) {
  if (!isDownloading) return;
  const galleryUrl = pageNum === 0 ? baseGalleryUrl : `${baseGalleryUrl}?p=${pageNum}`;
  console.log('[EHD Batch] Scraping URL:', galleryUrl);
  updateStatus(`Scraping page ${pageNum + 1} for "${galleryTitle || 'Unknown'}"`);
  GM_xmlhttpRequest({
    method: 'GET',
    url: galleryUrl,
    headers: { 'Cookie': document.cookie },
    timeout: 30000,
    onload: function(res) {
      if (!isDownloading) return;
      if (res.status !== 200) {
        console.error('[EHD Batch] Failed to fetch gallery page:', galleryUrl, res.status);
        alert(`Failed to fetch gallery page ${pageNum + 1} for ${galleryTitle}. Skipping.`);
        updateStatus(`Error: Failed to fetch page ${pageNum + 1} for "${galleryTitle}". Skipping.`);
        currentGalleryIndex++;
        setTimeout(() => fetchGalleryMetadata(currentGalleryIndex), 1000);
        return;
      }

      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(res.responseText, 'text/html');
        const pageLinks = Array.from(doc.querySelectorAll('a[href*="/s/"]'));
        const addedCount = pageLinks.length;
        pageURLsList.push(...pageLinks.map(a => a.href));
        totalCount = pageURLsList.length;

        if (totalCount === 0 && doc.getElementById('img')) {
          console.log('[EHD Batch] Single-page gallery detected.');
          pageURLsList = [galleryUrl];
          totalCount = 1;
          updateStatus(`Single-page gallery detected for "${galleryTitle}"`);
        }

        if (addedCount === 0) {
          console.warn('[EHD Batch] No more images found on page ${pageNum + 1}, stopping scrape.');
          finalizeScrape();
          return;
        }

        const nextPageLink = doc.querySelector('a[href*="?p="], a[onclick*="return nl("]');
        const fileCount = parseInt(galleries[currentGalleryIndex].metadata.filecount);
        if ((nextPageLink || totalCount < fileCount) && pageNum < 100) {
          console.log('[EHD Batch] Continuing to scrape page', pageNum + 2);
          setTimeout(() => scrapeGalleryPage(pageNum + 1, baseGalleryUrl), 1000);
        } else {
          finalizeScrape();
        }
      } catch (e) {
        console.error('[EHD Batch] Error parsing gallery page:', e);
        alert(`Failed to parse gallery page ${pageNum + 1} for ${galleryTitle}.`);
        updateStatus(`Error: Failed to parse page ${pageNum + 1} for "${galleryTitle}".`);
        currentGalleryIndex++;
        setTimeout(() => fetchGalleryMetadata(currentGalleryIndex), 1000);
      }
    },
    onerror: function(err) {
      if (!isDownloading) return;
      console.error('[EHD Batch] Scrape request error for', galleryUrl, ':', err);
      alert(`Failed to request gallery page ${pageNum + 1} for ${galleryTitle}.`);
      updateStatus(`Error: Failed to request page ${pageNum + 1} for "${galleryTitle}".`);
      currentGalleryIndex++;
      setTimeout(() => fetchGalleryMetadata(currentGalleryIndex), 1000);
    }
  });
}

function finalizeScrape() {
  const fileCount = parseInt(galleries[currentGalleryIndex].metadata.filecount);
  if (totalCount === 0) {
    console.error('[EHD Batch] No page links found after scraping.');
    updateStatus(`Error: No images found for "${galleryTitle}". Skipping.`);
    currentGalleryIndex++;
    setTimeout(() => fetchGalleryMetadata(currentGalleryIndex), 1000);
    return;
  }
  console.log(`[EHD Batch] Scraped ${totalCount} page URLs for ${galleryTitle}`);
  updateStatus(`Scraped ${totalCount} page URLs for "${galleryTitle}"`);
  if (totalCount < fileCount) {
    console.warn(`[EHD Batch] Scraped ${totalCount} links, expected ${fileCount}.`);
    updateStatus(`Warning: Scraped ${totalCount} links, expected ${fileCount}.`);
  }
  continueDownloadSetup();
}

function continueDownloadSetup() {
  imageList = new Array(totalCount).fill(null);
  imageData = new Array(totalCount).fill(null);
  retryCount = new Array(totalCount).fill(0);
  imageURLsList = new Array(totalCount).fill(null);
  failedCount = 0;
  downloadedCount = 0;
  fetchCount = 0;
  isPausing = false;

  if (totalCount > 50) {
    console.warn('[EHD Batch] Large gallery detected:', totalCount, 'images.');
    updateStatus(`Warning: Large gallery "${galleryTitle}" (${totalCount} images). Proceed with caution.`);
  }

  statusContainer.innerHTML = `
    <p id="ehD-status-text">Status: Starting download for "${galleryTitle}" (${currentGalleryIndex + 1}/${galleries.length}, ${totalCount} images)</p>
    <button id="ehD-pause">Pause</button>
    <button id="ehD-resume" disabled>Resume</button>
    <button id="ehD-cancel">Cancel</button>
    <button id="ehD-skip">Skip Gallery</button>
  `;
  statusContainer.appendChild(progressBar); // Ensure progress bar is present
  if (batchProgressBar) statusContainer.appendChild(batchProgressBar);

  const pauseBtn = statusContainer.querySelector('#ehD-pause');
  const resumeBtn = statusContainer.querySelector('#ehD-resume');
  const cancelBtn = statusContainer.querySelector('#ehD-cancel');
  const skipBtn = statusContainer.querySelector('#ehD-skip');

  pauseBtn.addEventListener('click', () => {
    isPausing = true;
    pauseBtn.disabled = true;
    resumeBtn.disabled = false;
    console.log('[EHD Batch] Paused download for', galleryTitle);
    updateUI(`Paused download for "${galleryTitle}" (${downloadedCount + failedCount}/${totalCount})`);
  });
  resumeBtn.addEventListener('click', () => {
    isPausing = false;
    pauseBtn.disabled = false;
    resumeBtn.disabled = true;
    console.log('[EHD Batch] Resumed download for', galleryTitle);
    updateUI(`Resumed download for "${galleryTitle}" (${downloadedCount + failedCount}/${totalCount})`);
    startFetching(downloadedCount + failedCount + fetchCount);
  });
  cancelBtn.addEventListener('click', () => {
    isDownloading = false;
    isPausing = false;
    console.log('[EHD Batch] Cancelled batch download');
    updateUI(`Cancelled batch download`);
    resetGlobals();
    resetUI();
  });
  skipBtn.addEventListener('click', () => {
    isPausing = false;
    console.log('[EHD Batch] Skipped gallery', galleryTitle);
    updateUI(`Skipped gallery "${galleryTitle}"`);
    currentGalleryIndex++;
    resetGlobals();
    resetUI();
    setTimeout(() => fetchGalleryMetadata(currentGalleryIndex), 1000);
  });
  console.log('[EHD Batch] Starting gallery:', galleryTitle, 'with', totalCount, 'images');

  if (!isPausing) startFetching(0);
}

function resetGlobals() {
  imageList = [];
  imageData = [];
  retryCount = [];
  pageURLsList = [];
  imageURLsList = [];
  failedCount = 0;
  downloadedCount = 0;
  fetchCount = 0;
  totalCount = 0;
  updateProgress();
  updateBatchProgress();
}

function resetUI() {
  updateUI('Idle');
  updateProgress();
  updateBatchProgress();
}

function startFetching(startIndex) {
  if (!isDownloading || isPausing) return;
  let started = 0;
  for (let i = startIndex; i < totalCount && fetchCount < MAX_CONCURRENT_FETCHES; i++) {
    if (imageData[i] === null) {
      imageData[i] = 'Fetching';
      fetchCount++;
      started++;
      getPageData(i);
    }
  }
  if (started > 0) {
    updateUI(`Fetching ${started} images starting from ${startIndex + 1} for "${galleryTitle}" (${downloadedCount + failedCount + fetchCount}/${totalCount})`);
  }
}

function getPageData(index) {
  if (!isDownloading) return;
  GM_xmlhttpRequest({
    method: 'GET',
    url: pageURLsList[index],
    headers: { 'Cookie': document.cookie },
    onload: function(res) {
      if (!isDownloading) return;
      const responseText = res.responseText;
      const patterns = [
        /<a href="(\S+?\/fullimg(?:\.php\?|\/)\S+?)"/i, // Full image link
        /<img id="img" src="(\S+?\.(?:jpg|png|gif|bmp)(?:\?\S*)?)"/i, // Main image
        /<img[^>]+src="(\S+?\.(?:jpg|png|gif|bmp)(?:\?\S*)?)"/i // Fallback
      ];
      let imageUrl;
      for (const pattern of patterns) {
        const match = responseText.match(pattern);
        if (match) {
          imageUrl = match[1];
          if (!imageUrl.includes('509.gif') && !imageUrl.includes('error')) {
            break;
          }
        }
      }
      if (imageUrl) {
        console.log('[EHD Batch] Found image URL for index', index, ':', imageUrl);
        validateImageUrl(index, imageUrl);
      } else {
        console.error('[EHD Batch] No valid image URL found for index', index, 'Page content:', responseText.substring(0, 500));
        handleFetchError(index);
      }
    },
    onerror: function(err) {
      if (!isDownloading) return;
      console.error('[EHD Batch] Failed to fetch page:', pageURLsList[index], err);
      handleFetchError(index);
    }
  });
}

function validateImageUrl(index, url) {
  if (!isDownloading) return;
  GM_xmlhttpRequest({
    method: 'HEAD',
    url: url,
    headers: {
      'Accept': 'image/jpeg,image/png,image/gif,image/bmp',
      'Cookie': document.cookie
    },
    onload: function(res) {
      if (!isDownloading) return;
      const contentType = res.responseHeaders.match(/content-type:.*?image\/(\w+)/i)?.[1] || '';
      const contentLength = parseInt(res.responseHeaders.match(/content-length:.*?(\d+)/i)?.[1] || '0', 10);
      if (res.status === 200 && contentType.match(/jpeg|jpg|png|gif|bmp/i) && contentLength > 10000) {
        console.log('[EHD Batch] Validated image URL for index', index, ':', url, 'Size:', contentLength, 'Type:', contentType);
        downloadImage(index, url);
      } else {
        console.error('[EHD Batch] Invalid image URL for index', index, ':', url, 'Status:', res.status, 'Type:', contentType, 'Size:', contentLength);
        handleFetchError(index);
      }
    },
    onerror: function(err) {
      if (!isDownloading) return;
      console.error('[EHD Batch] HEAD request failed for', url, err);
      handleFetchError(index);
    }
  });
}

function downloadImage(index, url) {
  if (!isDownloading) return;
  GM_xmlhttpRequest({
    method: 'GET',
    url: url,
    responseType: 'blob',
    headers: {
      'Accept': 'image/jpeg,image/png,image/gif,image/bmp',
      'Referer': `https://${host}/s/${galleries[currentGalleryIndex].gid}-${index + 1}`,
      'User-Agent': navigator.userAgent,
      'Cookie': document.cookie // Pass session cookies
    },
    onload: function(res) {
      if (!isDownloading) return;
      const blob = res.response;
      if (blob instanceof Blob && blob.size > 10000 && blob.type.startsWith('image/')) {
        console.log('[EHD Batch] Downloaded image for index', index, ':', url, 'Size:', blob.size);
        imageList[index] = blob;
        imageURLsList[index] = url;
        imageData[index] = 'Done'; // Set to prevent re-fetch
        downloadedCount++;
        fetchCount--;
        updateUI(`Downloaded image ${index + 1} of ${totalCount} for "${galleryTitle}" (${downloadedCount}/${totalCount})`);
        if (!isPausing) startFetching(0);
        checkCompletion();
      } else {
        console.error('[EHD Batch] Invalid or small blob for image', index + 1, 'URL:', url, 'Size:', blob?.size || 0, 'Type:', blob?.type || 'unknown');
        handleFetchError(index);
      }
    },
    onerror: function(err) {
      if (!isDownloading) return;
      console.error('[EHD Batch] Error downloading image', index + 1, 'URL:', url, err);
      if (err.status === 0 && retryCount[index] < 3) {
        retryCount[index]++;
        const delay = Math.min(60000, 1000 * Math.pow(2, retryCount[index]));
        console.log('[EHD Batch] Retrying image', index + 1, 'after', delay, 'ms due to status: 0');
        setTimeout(() => {
          if (!isDownloading) return;
          imageData[index] = null;
          fetchCount--;
          startFetching(index);
        }, delay);
      } else {
        handleFetchError(index);
      }
    }
  });
}

function handleFetchError(index) {
  if (!isDownloading) return;
  retryCount[index]++;
  if (retryCount[index] < 3) {
    imageData[index] = null;
    fetchCount--;
    updateUI(`Retrying image ${index + 1} of ${totalCount} in "${galleryTitle}" (Attempt ${retryCount[index]}/3)`);
    if (!isPausing) startFetching(index);
  } else {
    imageData[index] = 'Failed'; // Set to prevent re-fetch
    failedCount++;
    fetchCount--;
    updateUI(`Failed to download image ${index + 1} of ${totalCount} in "${galleryTitle}" after 3 attempts (${downloadedCount}/${totalCount})`);
    if (!isPausing) startFetching(0);
    checkCompletion();
  }
}

function checkCompletion() {
  if (downloadedCount + failedCount === totalCount) {
    saveDownloaded();
  }
}

async function saveDownloaded() {
  if (!isDownloading) return;
  console.log('[EHD Batch] Entering saveDownloaded for', galleryTitle, 'Downloaded:', downloadedCount, 'Failed:', failedCount);

  if (!window.fflate) {
    console.log('[EHD Batch] fflate not loaded via @require, fetching manually.');
    const urls = [
      'https://unpkg.com/fflate@0.8.3/dist/fflate.min.js',
      'https://cdn.jsdelivr.net/npm/fflate@0.8.3/lib/index.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/fflate/0.8.3/fflate.min.js'
    ];
    for (const url of urls) {
      try {
        const res = await new Promise((resolve, reject) => {
          GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: resolve,
            onerror: reject
          });
        });
        if (res.status === 200) {
          (function() { eval(res.responseText); }).call(window);
          console.log('[EHD Batch] fflate loaded manually successfully from', url);
          break;
        } else {
          throw new Error(`Failed to fetch fflate from ${url}: ${res.status}`);
        }
      } catch (err) {
        console.error('[EHD Batch] Failed to load fflate from', url, ':', err);
        if (url === urls[urls.length - 1]) {
          alert(`Failed to load compression library for ZIP creation. Check console.`);
          updateStatus(`Error: Failed to load compression library for "${galleryTitle}"`);
          currentGalleryIndex++;
          setTimeout(() => fetchGalleryMetadata(currentGalleryIndex), 1000);
          return;
        }
      }
    }
  }

  if (!window.fflate || !window.fflate.zipSync) {
    console.error('[EHD Batch] fflate or zipSync unavailable after load attempts.');
    alert(`Compression library unavailable for ${galleryTitle}. Check console.`);
    updateStatus(`Error: Compression library unavailable for "${galleryTitle}"`);
    currentGalleryIndex++;
    setTimeout(() => fetchGalleryMetadata(currentGalleryIndex), 1000);
    return;
  }

  if (failedCount > 0) {
    alert(`Some images (${failedCount}) failed for ${galleryTitle}. Proceeding with available images.`);
    updateStatus(`Some images (${failedCount}) failed for "${galleryTitle}". Creating ZIP with available images.`);
  }

  if (downloadedCount === 0) {
    console.error('[EHD Batch] No images downloaded for', galleryTitle, '. Skipping.');
    alert(`No images downloaded successfully for ${galleryTitle}. Skipping.`);
    updateStatus(`Error: No images downloaded for "${galleryTitle}". Skipping.`);
    currentGalleryIndex++;
    resetGlobals();
    setTimeout(() => fetchGalleryMetadata(currentGalleryIndex), 1000);
    return;
  }

  updateStatus(`Preparing ZIP for "${galleryTitle}" (${downloadedCount} images)`);
  console.log('[EHD Batch] Initializing ZIP with', downloadedCount, 'images for', galleryTitle);

  try {
    const archive = {};
    let processedCount = 0;
    const sanitizedTitle = galleryTitle.replace(/[/\\?%*:|"<>]/g, '-').replace(/\s+/g, '_').substring(0, 97);

    for (let i = 0; i < imageList.length; i++) {
      if (imageList[i] && imageList[i] instanceof Blob && imageList[i].size > 0) {
        const url = imageURLsList[i] || '';
        const ext = (url.match(/\.(\w+)(?:$|\?)/)?.[1] || 'jpg').toLowerCase();
        const filename = `image_${String(i + 1).padStart(3, '0')}.${ext}`;
        console.log('[EHD Batch] Adding to ZIP:', filename, 'Size:', imageList[i].size);
        const arrayBuffer = await imageList[i].arrayBuffer();
        archive[filename] = [new Uint8Array(arrayBuffer), { level: 0 }];
        imageList[i] = null;
        imageURLsList[i] = null;
        processedCount++;
      } else {
        console.warn('[EHD Batch] Skipping invalid or empty blob at index', i);
      }
    }

    console.log('[EHD Batch] Generating ZIP for', galleryTitle, 'with', processedCount, 'images');
    const zipped = window.fflate.zipSync(archive);
    const zipFileBlob = new Blob([zipped], { type: 'application/zip' });

    console.log('[EHD Batch] ZIP generated successfully for', galleryTitle);
    const link = document.createElement('a');
    link.href = URL.createObjectURL(zipFileBlob);
    link.download = `${sanitizedTitle}_${galleries[currentGalleryIndex].gid}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
    console.log('[EHD Batch] ZIP download triggered for', galleryTitle);
    updateStatus(`Downloaded ZIP for "${galleryTitle}"`);
    currentGalleryIndex++;
    resetGlobals();
    updateBatchProgress();
    setTimeout(() => fetchGalleryMetadata(currentGalleryIndex), 1000);
  } catch (err) {
    console.error('[EHD Batch] ZIP creation error for', galleryTitle, ':', err);
    alert(`Failed to create ZIP for ${galleryTitle}: ${err.message}. Check console.`);
    updateStatus(`Error: Failed to create ZIP for "${galleryTitle}": ${err.message}`);
    currentGalleryIndex++;
    resetGlobals();
    setTimeout(() => fetchGalleryMetadata(currentGalleryIndex), 1000);
  }
}

function updateStatus(message) {
  const statusP = document.getElementById('ehD-status-text');
  if (statusP) statusP.textContent = `Status: ${message}`;
  console.log('[EHD Batch] Status:', message);
}

function updateUI(message) {
  updateStatus(message);
  updateProgress();
}

function updateProgress() {
  const progress = document.getElementById('ehD-progress');
  if (progress && totalCount > 0) {
    progress.value = ((downloadedCount + failedCount) / totalCount) * 100;
  } else if (progress) {
    progress.value = 0;
  }
}

function updateBatchProgress() {
  const batchProgress = document.getElementById('ehD-batch-progress');
  if (batchProgress && galleries.length > 0) {
    batchProgress.value = (currentGalleryIndex / galleries.length) * 100;
  } else if (batchProgress) {
    batchProgress.value = 0;
  }
}

const MAX_CONCURRENT_FETCHES = 3; // Reduced to avoid rate-limiting
const API_BATCH_SIZE = 10; // Reduced to avoid potential limits

initSetting();