// ==UserScript==
// @name         YouTube Timestamp Saver Ultimate
// @namespace    http://tampermonkey.net/
// @version      4.4
// @description  Save, organize, and navigate YouTube video timestamps with favorites | Made With 💖 by @AZXAD
// @author       @AZXAD
// @license      CC-BY-NC-ND-4.0
// @match        https://www.youtube.com/*
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/555619/YouTube%20Timestamp%20Saver%20Ultimate.user.js
// @updateURL https://update.greasyfork.org/scripts/555619/YouTube%20Timestamp%20Saver%20Ultimate.meta.js
// ==/UserScript==

/*
 * YouTube Timestamp Saver Ultimate
 * Copyright (c) 2025 @AZXAD
 * 
 * Licensed under CC BY-NC-ND 4.0
 * https://creativecommons.org/licenses/by-nc-nd/4.0/
 */

(function() {
    'use strict';

    const AUTHOR = '@AZXAD';
    const WATERMARK = 'Made With 💖 by @AZXAD';
    const SCRIPT_URL = 'https://greasyfork.org/en/scripts/555619-youtube-timestamp-saver-ultimate';

    let timestamps = [];
    let currentVideoId = '';
    let markerContainer = null;
    let previewTooltip = null;
    let urlObserver = null;
    let markerUpdateInterval = null;
    let videoElement = null;
    let showOnlyFavorites = false;

    const storage = {
        getItem(key) {
            try {
                return localStorage.getItem(key);
            } catch (e) {
                console.error('localStorage get error:', e);
                return null;
            }
        },
        setItem(key, value) {
            try {
                localStorage.setItem(key, value);
                return true;
            } catch (e) {
                if (e.name === 'QuotaExceededError' || e.code === 22 || e.code === 1014) {
                    showNotification('⚠️ Storage full! Clear old timestamps or browser data.');
                } else {
                    showNotification('⚠️ Storage error. Check browser settings.');
                }
                console.error('localStorage set error:', e);
                return false;
            }
        },
        removeItem(key) {
            try {
                localStorage.removeItem(key);
            } catch (e) {
                console.error('localStorage remove error:', e);
            }
        }
    };

    GM_addStyle(`
        #timestamp-panel {
            position: fixed;
            top: 80px;
            right: 20px;
            width: 350px;
            max-height: 500px;
            background: #1f1f1f;
            border: 2px solid #3ea6ff;
            border-radius: 8px;
            color: white;
            font-family: Arial, sans-serif;
            z-index: 10000;
            display: none;
            overflow: hidden;
        }
        #timestamp-header {
            background: #3ea6ff;
            padding: 10px;
            font-weight: bold;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        #timestamp-list {
            max-height: 350px;
            overflow-y: auto;
            padding: 10px;
        }
        .timestamp-item {
            background: #2d2d2d;
            margin: 8px 0;
            padding: 8px;
            border-radius: 5px;
            font-size: 12px;
            position: relative;
            border: 2px solid transparent;
            transition: border-color 0.2s;
        }
        .timestamp-item.favorite {
            background: #3a2d1f;
            border: 2px solid #ffd700;
        }
        .timestamp-time {
            color: #3ea6ff;
            font-weight: bold;
            cursor: pointer;
        }
        .timestamp-time:hover {
            text-decoration: underline;
        }
        .timestamp-note {
            color: #aaa;
            margin-top: 5px;
            word-wrap: break-word;
        }
        .timestamp-actions {
            float: right;
            display: flex;
            gap: 5px;
        }
        .timestamp-favorite {
            color: #888;
            cursor: pointer;
            font-size: 16px;
            transition: color 0.2s;
        }
        .timestamp-favorite.active {
            color: #ffd700;
        }
        .timestamp-favorite:hover {
            color: #ffd700;
        }
        .timestamp-delete {
            color: #ff4444;
            cursor: pointer;
            font-size: 16px;
        }
        .timestamp-edit {
            color: #ffaa00;
            cursor: pointer;
            font-size: 14px;
        }
        #timestamp-controls {
            padding: 10px;
            background: #282828;
            display: flex;
            gap: 5px;
            justify-content: space-between;
            flex-wrap: wrap;
        }
        .control-btn {
            padding: 6px 12px;
            background: #3ea6ff;
            border: none;
            border-radius: 4px;
            color: white;
            cursor: pointer;
            font-size: 11px;
            flex: 1;
            min-width: 70px;
        }
        .control-btn:hover {
            background: #2d8fd8;
        }
        .control-btn.active {
            background: #ffd700;
            color: #000;
        }
        #close-panel {
            cursor: pointer;
            font-size: 20px;
        }
        #timestamp-footer {
            padding: 8px 10px;
            background: #1a1a1a;
            text-align: center;
            font-size: 10px;
            color: #888;
            border-top: 1px solid #333;
        }
        #timestamp-footer a {
            color: #3ea6ff;
            text-decoration: none;
        }
        #timestamp-counter {
            position: fixed;
            top: 70px;
            left: 20px;
            background: rgba(255, 0, 0, 0.9);
            color: white;
            padding: 8px 12px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: bold;
            z-index: 9999;
            font-family: Arial, sans-serif;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            display: none;
        }
        #timestamp-counter.show {
            display: block;
        }
        .timestamp-marker-container {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 31;
        }
        .timestamp-marker {
            position: absolute;
            bottom: 0;
            width: 8px;
            height: 8px;
            background: #ff0000;
            border-radius: 50%;
            transform: translateX(-50%);
            cursor: pointer;
            pointer-events: all;
            box-shadow: 0 0 4px rgba(255, 0, 0, 0.8);
            transition: all 0.2s ease;
        }
        .timestamp-marker.favorite {
            background: #ffd700;
            box-shadow: 0 0 6px rgba(255, 215, 0, 0.9);
        }
        .timestamp-marker:hover {
            width: 12px;
            height: 12px;
            background: #ff3333;
            box-shadow: 0 0 8px rgba(255, 0, 0, 1);
        }
        .timestamp-marker.favorite:hover {
            background: #ffed4e;
            box-shadow: 0 0 10px rgba(255, 215, 0, 1);
        }
        .timestamp-marker-tooltip {
            position: absolute;
            bottom: 12px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 11px;
            white-space: nowrap;
            display: none;
            z-index: 2000;
        }
        .timestamp-marker:hover .timestamp-marker-tooltip {
            display: block;
        }
        #seekbar-preview {
            position: absolute;
            bottom: 15px;
            background: rgba(0, 0, 0, 0.95);
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 12px;
            white-space: nowrap;
            z-index: 2100;
            pointer-events: none;
            display: none;
            border: 1px solid #3ea6ff;
            max-width: 250px;
        }
        #seekbar-preview.show {
            display: block;
        }
        .preview-time {
            color: #3ea6ff;
            font-weight: bold;
        }
        .preview-note {
            color: #ccc;
            margin-top: 3px;
            font-size: 11px;
            white-space: normal;
        }
    `);

    function cleanup() {
        document.querySelectorAll('.timestamp-marker-container').forEach(el => el.remove());
        
        if (markerContainer && markerContainer.parentNode) {
            markerContainer.remove();
        }
        markerContainer = null;
        
        if (markerUpdateInterval) {
            clearInterval(markerUpdateInterval);
            markerUpdateInterval = null;
        }
        if (videoElement) {
            videoElement.removeEventListener('loadedmetadata', onVideoMetadataLoaded);
            videoElement = null;
        }
    }

    function formatTime(seconds) {
        if (!isFinite(seconds)) return '00:00:00';
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        return [hours, minutes, secs].map(val => val.toString().padStart(2, '0')).join(':');
    }

    function getVideo() {
        return document.querySelector('video');
    }

    function getVideoId() {
        const urlParams = new URLSearchParams(window.location.search);
        const videoId = urlParams.get('v');
        if (!videoId && window.location.pathname.includes('/embed/')) {
            return window.location.pathname.split('/embed/')[1]?.split('?')[0];
        }
        return videoId;
    }

    function getVideoTitle() {
        const titleElement = document.querySelector('h1.ytd-video-primary-info-renderer') || 
                           document.querySelector('yt-formatted-string.style-scope.ytd-watch-metadata') ||
                           document.querySelector('#container h1');
        const title = titleElement ? titleElement.textContent.trim() : 'Unknown Video';
        return title.substring(0, 200);
    }

    function sanitizeHTML(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function checkDuplicate(newTime) {
        const tolerance = 5;
        for (let item of timestamps) {
            if (Math.abs(item.time - newTime) < tolerance) {
                return item;
            }
        }
        return null;
    }

    function updateCounter() {
        let counter = document.getElementById('timestamp-counter');
        if (!counter) {
            counter = document.createElement('div');
            counter.id = 'timestamp-counter';
            counter.innerHTML = '📌 <span id="counter-value">0</span>';
            document.body.appendChild(counter);
        }
        
        const value = counter.querySelector('#counter-value');
        if (value) {
            const favCount = timestamps.filter(t => t.favorite).length;
            if (favCount > 0) {
                value.textContent = `${timestamps.length} (⭐${favCount})`;
            } else {
                value.textContent = timestamps.length;
            }
        }
        
        if (timestamps.length > 0) {
            counter.classList.add('show');
        } else {
            counter.classList.remove('show');
        }
    }

    function loadTimestamps() {
        const videoId = getVideoId();
        if (!videoId) {
            timestamps = [];
            updateCounter();
            return;
        }
        
        const saved = storage.getItem(`yt_timestamps_${videoId}`);
        if (saved) {
            try {
                timestamps = JSON.parse(saved);
                timestamps.sort((a, b) => a.time - b.time);
            } catch (e) {
                console.error('Error parsing timestamps:', e);
                timestamps = [];
            }
        } else {
            timestamps = [];
        }
        updateCounter();
    }

    function saveTimestamps() {
        const videoId = getVideoId();
        if (!videoId) return false;
        
        timestamps.sort((a, b) => a.time - b.time);
        
        const success = storage.setItem(`yt_timestamps_${videoId}`, JSON.stringify(timestamps));
        if (success) {
            updateCounter();
        }
        return success;
    }

    // Toggle favorite status
    function toggleFavorite(index) {
        if (index < 0 || index >= timestamps.length) return;
        
        timestamps[index].favorite = !timestamps[index].favorite;
        saveTimestamps();
        updatePanel();
        updateSeekbarMarkers();
        
        const status = timestamps[index].favorite ? '⭐ Favorited' : 'Removed from favorites';
        showNotification(status);
    }

    // Navigate to next timestamp
    function jumpToNextTimestamp() {
        const video = getVideo();
        if (!video || timestamps.length === 0) {
            showNotification('No timestamps available');
            return;
        }

        const currentTime = video.currentTime;
        const nextTimestamp = timestamps.find(t => t.time > currentTime + 1);
        
        if (nextTimestamp) {
            video.currentTime = nextTimestamp.time;
            const favIcon = nextTimestamp.favorite ? '⭐ ' : '';
            showNotification(`${favIcon}Next: ${formatTime(nextTimestamp.time)}`);
        } else {
            showNotification('Already at last timestamp');
        }
    }

    // Navigate to previous timestamp
    function jumpToPreviousTimestamp() {
        const video = getVideo();
        if (!video || timestamps.length === 0) {
            showNotification('No timestamps available');
            return;
        }

        const currentTime = video.currentTime;
        const reversedTimestamps = [...timestamps].reverse();
        const prevTimestamp = reversedTimestamps.find(t => t.time < currentTime - 1);
        
        if (prevTimestamp) {
            video.currentTime = prevTimestamp.time;
            const favIcon = prevTimestamp.favorite ? '⭐ ' : '';
            showNotification(`${favIcon}Previous: ${formatTime(prevTimestamp.time)}`);
        } else {
            showNotification('Already at first timestamp');
        }
    }

    function exportBackup() {
        const allData = {};
        let count = 0;
        
        try {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('yt_timestamps_')) {
                    const data = storage.getItem(key);
                    if (data) {
                        allData[key] = JSON.parse(data);
                        count++;
                    }
                }
            }
            
            allData['_metadata'] = {
                version: '4.3',
                author: AUTHOR,
                exported: new Date().toISOString(),
                credit: WATERMARK,
                scriptUrl: SCRIPT_URL
            };
        } catch (e) {
            showNotification('Error creating backup: ' + e.message);
            return;
        }
        
        const dataStr = JSON.stringify(allData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `youtube_timestamps_backup_${Date.now()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
        showNotification(`Backup downloaded! (${count} videos)`);
    }

    function importBackup() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            if (file.size > 10 * 1024 * 1024) {
                showNotification('⚠️ File too large (max 10MB)');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    let count = 0;
                    let failed = 0;
                    
                    for (let key in data) {
                        if (key.startsWith('yt_timestamps_')) {
                            const success = storage.setItem(key, JSON.stringify(data[key]));
                            if (success) {
                                count++;
                            } else {
                                failed++;
                            }
                        }
                    }
                    
                    loadTimestamps();
                    updatePanel();
                    updateSeekbarMarkers();
                    
                    if (failed > 0) {
                        showNotification(`Imported ${count} videos. ${failed} failed (storage full?)`);
                    } else {
                        showNotification(`Imported ${count} video(s) successfully!`);
                    }
                } catch (err) {
                    showNotification('⚠️ Invalid backup file format');
                    console.error('Import error:', err);
                }
            };
            reader.readAsText(file);
        };
        
        input.click();
    }

    function createSeekbarPreview() {
        if (document.getElementById('seekbar-preview')) return;
        
        const preview = document.createElement('div');
        preview.id = 'seekbar-preview';
        document.body.appendChild(preview);
        previewTooltip = preview;
    }

    function showSeekbarPreview(mouseX, progressBar) {
        const video = getVideo();
        if (!video || !previewTooltip || timestamps.length === 0 || !isFinite(video.duration)) return;
        
        const rect = progressBar.getBoundingClientRect();
        const percentage = Math.max(0, Math.min(1, (mouseX - rect.left) / rect.width));
        const hoverTime = percentage * video.duration;
        
        const nearby = timestamps.filter(item => Math.abs(item.time - hoverTime) < 30)
            .sort((a, b) => Math.abs(a.time - hoverTime) - Math.abs(b.time - hoverTime))
            .slice(0, 3);
        
        if (nearby.length > 0) {
            let html = nearby.map(item => {
                const sanitizedNote = item.note ? sanitizeHTML(item.note) : '';
                const favIcon = item.favorite ? '⭐ ' : '';
                return `
                    <div class="preview-time">${favIcon}${formatTime(item.time)}</div>
                    ${sanitizedNote ? `<div class="preview-note">${sanitizedNote}</div>` : ''}
                `;
            }).join('<hr style="border: 1px solid #444; margin: 5px 0;">');
            
            previewTooltip.innerHTML = html;
            previewTooltip.style.left = Math.min(mouseX, window.innerWidth - 270) + 'px';
            previewTooltip.classList.add('show');
        } else {
            previewTooltip.classList.remove('show');
        }
    }

    function setupSeekbarHover() {
        const progressBar = document.querySelector('.ytp-progress-bar-container') ||
                          document.querySelector('.ytp-progress-bar');
        if (!progressBar) return;
        
        progressBar.addEventListener('mousemove', (e) => {
            showSeekbarPreview(e.clientX, progressBar);
        });
        
        progressBar.addEventListener('mouseleave', () => {
            if (previewTooltip) {
                previewTooltip.classList.remove('show');
            }
        });
    }

    function onVideoMetadataLoaded() {
        updateSeekbarMarkers();
    }

    function updateSeekbarMarkers() {
        const video = getVideo();
        if (!video) return;
        
        if (!isFinite(video.duration) || video.duration === 0) {
            if (videoElement !== video) {
                videoElement = video;
                video.addEventListener('loadedmetadata', onVideoMetadataLoaded, { once: true });
            }
            return;
        }

        const progressBar = document.querySelector('.ytp-progress-bar-container') || 
                          document.querySelector('.ytp-progress-bar') ||
                          document.querySelector('.ytp-progress-bar-padding');
        
        if (!progressBar) {
            setTimeout(updateSeekbarMarkers, 500);
            return;
        }

        if (markerContainer && markerContainer.parentNode) {
            markerContainer.remove();
            markerContainer = null;
        }

        markerContainer = document.createElement('div');
        markerContainer.className = 'timestamp-marker-container';
        progressBar.appendChild(markerContainer);

        timestamps.forEach((item, index) => {
            const percentage = (item.time / video.duration) * 100;
            if (percentage < 0 || percentage > 100) return;
            
            const marker = document.createElement('div');
            marker.className = 'timestamp-marker';
            if (item.favorite) {
                marker.classList.add('favorite');
            }
            marker.style.left = `${percentage}%`;
            marker.dataset.time = item.time;
            marker.dataset.index = index;

            const tooltip = document.createElement('div');
            tooltip.className = 'timestamp-marker-tooltip';
            const sanitizedNote = item.note ? sanitizeHTML(item.note) : '';
            const favIcon = item.favorite ? '⭐ ' : '';
            tooltip.textContent = sanitizedNote ? `${favIcon}${formatTime(item.time)} - ${item.note}` : `${favIcon}${formatTime(item.time)}`;
            marker.appendChild(tooltip);

            marker.addEventListener('click', (e) => {
                e.stopPropagation();
                video.currentTime = parseFloat(marker.dataset.time);
            });

            markerContainer.appendChild(marker);
        });
    }

    function createPanel() {
        const existingPanel = document.getElementById('timestamp-panel');
        if (existingPanel) {
            existingPanel.remove();
        }

        const panel = document.createElement('div');
        panel.id = 'timestamp-panel';
        panel.innerHTML = `
            <div id="timestamp-header">
                <span>Timestamps (${timestamps.length})</span>
                <span id="close-panel">×</span>
            </div>
            <div id="timestamp-list"></div>
            <div id="timestamp-controls">
                <button class="control-btn" id="filter-favorites-btn">⭐ Favorites</button>
                <button class="control-btn" id="clear-all">Clear All</button>
                <button class="control-btn" id="export-btn">Export</button>
                <button class="control-btn" id="backup-btn">💾 Backup</button>
                <button class="control-btn" id="import-btn">📁 Import</button>
            </div>
            <div id="timestamp-footer">${WATERMARK}</div>
        `;
        document.body.appendChild(panel);

        document.getElementById('close-panel').addEventListener('click', () => {
            panel.style.display = 'none';
        });

        document.getElementById('filter-favorites-btn').addEventListener('click', () => {
            showOnlyFavorites = !showOnlyFavorites;
            updatePanel();
            const btn = document.getElementById('filter-favorites-btn');
            if (showOnlyFavorites) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        document.getElementById('clear-all').addEventListener('click', () => {
            if (confirm('Clear all timestamps for this video?')) {
                timestamps = [];
                saveTimestamps();
                updatePanel();
                updateSeekbarMarkers();
                showNotification('All timestamps cleared');
            }
        });

        document.getElementById('export-btn').addEventListener('click', exportTimestamps);
        document.getElementById('backup-btn').addEventListener('click', exportBackup);
        document.getElementById('import-btn').addEventListener('click', importBackup);
    }

    function updatePanel() {
        const list = document.getElementById('timestamp-list');
        if (!list) return;

        const header = document.querySelector('#timestamp-header span');
        if (header) {
            const favCount = timestamps.filter(t => t.favorite).length;
            if (showOnlyFavorites) {
                header.textContent = `Favorites (${favCount})`;
            } else {
                header.textContent = `Timestamps (${timestamps.length})`;
            }
        }

        const displayTimestamps = showOnlyFavorites ? 
            timestamps.filter(t => t.favorite) : 
            timestamps;

        if (displayTimestamps.length === 0) {
            const message = showOnlyFavorites ? 
                'No favorite timestamps' : 
                'No timestamps saved';
            list.innerHTML = `<div style="text-align: center; color: #aaa; padding: 20px;">${message}</div>`;
            return;
        }

        list.innerHTML = displayTimestamps.map((item, displayIndex) => {
            const realIndex = timestamps.indexOf(item);
            const sanitizedNote = item.note ? sanitizeHTML(item.note) : '';
            const favoriteClass = item.favorite ? 'favorite' : '';
            const favoriteIcon = item.favorite ? 'active' : '';
            
            return `
                <div class="timestamp-item ${favoriteClass}">
                    <div class="timestamp-actions">
                        <span class="timestamp-favorite ${favoriteIcon}" data-index="${realIndex}">★</span>
                        <span class="timestamp-edit" data-index="${realIndex}">✎</span>
                        <span class="timestamp-delete" data-index="${realIndex}">×</span>
                    </div>
                    <div class="timestamp-time" data-time="${item.time}">${formatTime(item.time)}</div>
                    ${sanitizedNote ? `<div class="timestamp-note">${sanitizedNote}</div>` : ''}
                </div>
            `;
        }).join('');

        list.querySelectorAll('.timestamp-time').forEach(el => {
            el.addEventListener('click', () => {
                const video = getVideo();
                if (video) {
                    video.currentTime = parseFloat(el.dataset.time);
                }
            });
        });

        list.querySelectorAll('.timestamp-favorite').forEach(el => {
            el.addEventListener('click', () => {
                const index = parseInt(el.dataset.index);
                toggleFavorite(index);
            });
        });

        list.querySelectorAll('.timestamp-delete').forEach(el => {
            el.addEventListener('click', () => {
                const index = parseInt(el.dataset.index);
                timestamps.splice(index, 1);
                saveTimestamps();
                updatePanel();
                updateSeekbarMarkers();
                showNotification('Timestamp deleted');
            });
        });

        list.querySelectorAll('.timestamp-edit').forEach(el => {
            el.addEventListener('click', () => {
                const index = parseInt(el.dataset.index);
                editTimestamp(index);
            });
        });
    }

    function editTimestamp(index) {
        if (index < 0 || index >= timestamps.length) return;
        
        const item = timestamps[index];
        const newNote = prompt(`Edit note for ${formatTime(item.time)}:`, item.note || '');
        
        if (newNote !== null) {
            timestamps[index].note = newNote.trim().substring(0, 500);
            saveTimestamps();
            updatePanel();
            updateSeekbarMarkers();
            showNotification('Timestamp updated!');
        }
    }

    function exportTimestamps() {
        if (timestamps.length === 0) {
            showNotification('No timestamps to export');
            return;
        }

        const videoTitle = getVideoTitle();
        const videoUrl = window.location.href.split('&')[0];
        
        let output = `Video: ${videoTitle}\nURL: ${videoUrl}\n\nTimestamps:\n`;
        output += timestamps.map(item => {
            const time = formatTime(item.time);
            const favIcon = item.favorite ? '⭐ ' : '';
            return item.note ? `${favIcon}${time} - ${item.note}` : `${favIcon}${time}`;
        }).join('\n');
        
        const favCount = timestamps.filter(t => t.favorite).length;
        if (favCount > 0) {
            output += `\n\nFavorites: ${favCount}`;
        }
        
        output += `\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        output += `${WATERMARK}\n`;
        output += `\n📥 Get this script: ${SCRIPT_URL}\n`;
        output += `⭐ If you find this useful, please leave a review!\n`;
        output += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

        GM_setClipboard(output);
        showNotification(`✅ Exported ${timestamps.length} timestamps!`);
    }

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 10001;
            font-size: 14px;
            font-family: Arial, sans-serif;
            border: 2px solid #3ea6ff;
        `;
        document.body.appendChild(notification);
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 2500);
    }

    document.addEventListener('keydown', function(event) {
        const videoId = getVideoId();
        if (!videoId) return;

        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') return;

        // Alt+X: Save timestamp
        if (event.altKey && event.key.toLowerCase() === 'x') {
            event.preventDefault();
            const video = getVideo();
            if (!video || !isFinite(video.currentTime)) return;

            const currentTime = video.currentTime;
            const duplicate = checkDuplicate(currentTime);
            
            if (duplicate) {
                const proceed = confirm(`Similar timestamp exists at ${formatTime(duplicate.time)}.\nAdd anyway?`);
                if (!proceed) return;
            }
            
            const note = prompt('Add a note (optional):');
            
            if (note !== null) {
                timestamps.push({
                    time: currentTime,
                    note: note.trim().substring(0, 500),
                    videoTitle: getVideoTitle(),
                    favorite: false
                });
                if (saveTimestamps()) {
                    updatePanel();
                    updateSeekbarMarkers();
                    showNotification(`Saved: ${formatTime(currentTime)}`);
                }
            }
        }

        // Alt+C: Export timestamps
        if (event.altKey && event.key.toLowerCase() === 'c') {
            event.preventDefault();
            exportTimestamps();
        }

        // Alt+Z: Toggle panel
        if (event.altKey && event.key.toLowerCase() === 'z') {
            event.preventDefault();
            const panel = document.getElementById('timestamp-panel');
            if (panel) {
                panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
                if (panel.style.display === 'block') {
                    updatePanel();
                }
            }
        }

        // Alt+D: Delete last timestamp
        if (event.altKey && event.key.toLowerCase() === 'd') {
            event.preventDefault();
            if (timestamps.length > 0) {
                const deleted = timestamps.pop();
                saveTimestamps();
                updatePanel();
                updateSeekbarMarkers();
                showNotification(`Deleted: ${formatTime(deleted.time)}`);
            }
        }

        // Alt+E: Edit last timestamp
        if (event.altKey && event.key.toLowerCase() === 'e') {
            event.preventDefault();
            if (timestamps.length > 0) {
                editTimestamp(timestamps.length - 1);
            } else {
                showNotification('No timestamps to edit');
            }
        }

        // Alt+N: Jump to next timestamp
        if (event.altKey && event.key.toLowerCase() === 'n') {
            event.preventDefault();
            jumpToNextTimestamp();
        }

        // Alt+M: Jump to previous timestamp
        if (event.altKey && event.key.toLowerCase() === 'm') {
            event.preventDefault();
            jumpToPreviousTimestamp();
        }
    });

    function init() {
        const videoId = getVideoId();
        
        if (videoId !== currentVideoId) {
            cleanup();
            currentVideoId = videoId;
            
            if (videoId) {
                loadTimestamps();
                createPanel();
                createSeekbarPreview();
                setupSeekbarHover();
                
                if (markerUpdateInterval) {
                    clearInterval(markerUpdateInterval);
                }
                markerUpdateInterval = setInterval(() => {
                    if (markerContainer && !document.contains(markerContainer)) {
                        updateSeekbarMarkers();
                    }
                }, 3000);
                
                setTimeout(() => {
                    const video = getVideo();
                    if (video) {
                        if (isFinite(video.duration) && video.duration > 0) {
                            updateSeekbarMarkers();
                        } else {
                            video.addEventListener('loadedmetadata', onVideoMetadataLoaded, { once: true });
                        }
                    }
                }, 500);
            }
        }
    }

    console.log('%c' + WATERMARK, 'color: #ff0000; font-size: 14px; font-weight: bold;');
    console.log('%cScript URL: ' + SCRIPT_URL, 'color: #3ea6ff; font-size: 12px;');

    let lastUrl = location.href;
    urlObserver = new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            init();
        }
    });
    
    urlObserver.observe(document, {
        subtree: true,
        childList: true
    });

    setTimeout(init, 2000);
    window.addEventListener('beforeunload', cleanup);
})();
