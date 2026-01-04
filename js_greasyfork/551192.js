// ==UserScript==
// @name         Advanced Audio Detector & Player
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Advanced audio detection including streaming, players, and network interception, with a sorted playlist, mobile-optimized UI, draggable button, top-right close, and "Open in New Tab" snapshot.
// @author       Ifrit Raen
// @license      mit
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551192/Advanced%20Audio%20Detector%20%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/551192/Advanced%20Audio%20Detector%20%20Player.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Audio file extensions and MIME types
    const audioExtensions = ['.mp3', '.wav', '.ogg', '.m4a', '.aac', '.flac', '.wma', '.opus', '.webm', '.3gp', '.amr', '.m3u8', '.mpd'];
    const primaryAudioExtensions = ['.mp3', '.m4a', '.wav', '.ogg', '.flac', '.opus', '.aac'];
    const streamExtensions = ['.m3u8', '.mpd'];
    const audioMimeTypes = [
        'audio/', 'video/mp4', 'video/webm', 'video/ogg', 'application/ogg',
        'application/vnd.apple.mpegurl', 'application/x-mpegurl', 'application/dash+xml'
    ];

    let audioFiles = new Map(); // URL -> {url, title, source, size, duration, detected}
    let floatingButton = null;
    let audioPlayer = null;
    let isExpanded = false;
    let currentAudio = null;
    let currentIndex = 0;
    let audioArray = [];
    let interceptedRequests = new Set();
// =========================
// Floating button (SMALLER, STYLISH, DRAGGABLE)  ⬇⬇⬇
// =========================
function createFloatingButton() {
    floatingButton = document.createElement('div');
    floatingButton.innerHTML = '🎵';
    floatingButton.title = 'Audio Detector';
    floatingButton.style.cssText = `
        position: fixed;
        bottom: 18px;
        right: 18px;
        width: 42px;
        height: 42px;
        background: linear-gradient(135deg, rgba(0, 123, 255, 0.95), rgba(0, 180, 200, 0.95));
        color: white;
        border: none;
        border-radius: 12px;
        cursor: grab;
        z-index: 100000;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        box-shadow: 0 8px 20px rgba(0,0,0,0.25);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        user-select: none;
        touch-action: none;
    `;

    floatingButton.addEventListener('mouseenter', () => {
        floatingButton.style.transform = 'translateY(-1px) scale(1.06)';
        floatingButton.style.boxShadow = '0 10px 24px rgba(0,0,0,0.3)';
    });

    floatingButton.addEventListener('mouseleave', () => {
        floatingButton.style.transform = 'none';
        floatingButton.style.boxShadow = '0 8px 20px rgba(0,0,0,0.25)';
    });

    // ⚡️ no click here anymore — handled in makeDraggable (tap vs drag)
    document.body.appendChild(floatingButton);
    makeDraggable(floatingButton); // <-- NEW
    updateButtonBadge();
}

// Draggable (mouse + touch, with tap detection)
function makeDraggable(el) {
    let startX, startY, startLeft, startTop, dragging = false, moved = false;

    const start = (clientX, clientY) => {
        dragging = true;
        moved = false;
        el.style.cursor = 'grabbing';
        const rect = el.getBoundingClientRect();
        startLeft = rect.left;
        startTop = rect.top;
        startX = clientX;
        startY = clientY;
        // detach from bottom/right to allow free move
        el.style.right = 'auto';
        el.style.bottom = 'auto';
        el.style.left = `${startLeft}px`;
        el.style.top = `${startTop}px`;
    };

    const move = (clientX, clientY) => {
        if (!dragging) return;
        const dx = clientX - startX;
        const dy = clientY - startY;
        if (Math.abs(dx) + Math.abs(dy) > 5) moved = true; // threshold
        el.style.left = `${startLeft + dx}px`;
        el.style.top = `${startTop + dy}px`;
    };

    const end = () => {
        if (!dragging) return;
        dragging = false;
        el.style.cursor = 'grab';
        if (!moved) {
            // Treat as tap / click
            toggleAudioPlayer();
        }
    };

    // Mouse
    el.addEventListener('mousedown', (e) => { start(e.clientX, e.clientY); e.preventDefault(); });
    window.addEventListener('mousemove', (e) => move(e.clientX, e.clientY));
    window.addEventListener('mouseup', end);

    // Touch
    el.addEventListener('touchstart', (e) => {
        const t = e.touches[0]; start(t.clientX, t.clientY); e.preventDefault();
    }, { passive: false });
    el.addEventListener('touchmove', (e) => {
        const t = e.touches[0]; move(t.clientX, t.clientY); e.preventDefault();
    }, { passive: false });
    el.addEventListener('touchend', end);
}

    // Update badge with count
    function updateButtonBadge() {
        if (!floatingButton) return;
        const count = audioFiles.size;
        if (count > 0) {
            floatingButton.innerHTML = `🎵<span style="
                position:absolute; top:-6px; right:-6px; background:#ff3b30; color:#fff;
                border-radius:10px; min-width:18px; height:18px; line-height:18px;
                font-size:11px; padding:0 4px; display:inline-flex; align-items:center; justify-content:center;
                box-shadow:0 2px 6px rgba(0,0,0,0.25);
            ">${count}</span>`;
        } else {
            floatingButton.innerHTML = '🎵';
        }
    }

    // Add audio file to collection
    function addAudioFile(url, metadata = {}) {
        if (!url || audioFiles.has(url)) return;

        const audioInfo = {
            url: url,
            title: metadata.title || extractFilename(url),
            source: metadata.source || 'Unknown',
            size: metadata.size || 'Unknown',
            duration: metadata.duration || 'Unknown',
            detected: new Date()
        };

        audioFiles.set(url, audioInfo);
        updateButtonBadge();

        if (isExpanded) {
            updateTrackList();
        }

        // console.log('🎵 Audio detected:', audioInfo);
    }

    // Extract filename from URL
    function extractFilename(url) {
        try {
            const urlObj = new URL(url);
            const pathname = urlObj.pathname;
            const filename = decodeURIComponent(pathname.split('/').pop());
            return filename || `audio_${Date.now()}`;
        } catch {
            return `audio_${Date.now()}`;
        }
    }

    // =========================
    // Player (CLOSE BUTTON TOP-RIGHT + OPEN IN NEW TAB) ⬇⬇⬇
    // =========================
    function createAudioPlayer() {
        audioPlayer = document.createElement('div');
        audioPlayer.style.cssText = `
            position: fixed;
            bottom: 76px;
            right: 10px;
            left: 10px;
            max-width: 95vw;
            max-height: 80vh;
            background: rgba(20, 20, 20, 0.95);
            border: 1px solid #333;
            border-radius: 12px;
            box-shadow: 0 12px 40px rgba(0,0,0,0.6);
            z-index: 99999;
            display: none;
            backdrop-filter: blur(10px);
            color: white;
            font-family: Arial, sans-serif;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        `;

        audioPlayer.innerHTML = `
            <div style="padding: 15px; border-bottom: 1px solid #333; display: flex; justify-content: space-between; align-items: center; gap: 8px; flex-wrap: wrap; position: relative;">
                <div style="font-weight: bold; font-size: 16px;">🎵 Advanced Audio Player</div>
                <div style="display: flex; gap: 8px; align-items: center;">
                    <button id="openInNewTab" style="background:#17a2b8; color:#fff; border:none; padding:4px 8px; border-radius:6px; cursor:pointer; font-size:12px;">🗗 Open in New Tab</button>
                    <button id="refreshDetection" style="background:#28a745; color:#fff; border:none; padding:4px 8px; border-radius:6px; cursor:pointer; font-size:12px;">🔄 Scan</button>
                    <button id="clearAll" style="background:#dc3545; color:#fff; border:none; padding:4px 8px; border-radius:6px; cursor:pointer; font-size:12px;">🗑️ Clear</button>
                </div>
                <!-- CLOSE BUTTON TOP-RIGHT -->
                <button id="closeAudioPlayer" title="Close" style="
                    position:absolute; top:8px; right:10px;
                    background:transparent; border:none; color:#fff; font-size:20px; cursor:pointer; padding:0; width:28px; height:28px; line-height:28px;
                ">×</button>
            </div>

            <div id="currentTrackInfo" style="padding: 15px; border-bottom: 1px solid #333; min-height: 80px; flex-shrink: 0;">
                <div id="trackTitle" style="font-size: 14px; font-weight: bold; margin-bottom: 5px; color: #fff;">No track selected</div>
                <div id="trackSource" style="font-size: 12px; color: #4CAF50; margin-bottom: 3px;"></div>
                <div id="trackUrl" style="font-size: 11px; color: #888; word-break: break-all; max-height: 40px; overflow: hidden;"></div>
            </div>

            <div id="audioPlayerControls" style="padding: 15px; background: rgba(0,0,0,0.3); flex-shrink: 0;">
                <audio id="mainAudioElement" style="width: 100%; margin-bottom: 10px;" controls preload="metadata">
                    Your browser does not support the audio element.
                </audio>

                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <button id="prevBtn" style="background: #444; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer;">⏮️ Prev</button>
                    <div style="display: flex; gap: 10px;">
                        <button id="playPauseBtn" style="background: #007bff; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: bold;">▶️ Play</button>
                        <button id="stopBtn" style="background: #dc3545; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer;">⏹️ Stop</button>
                    </div>
                    <button id="nextBtn" style="background: #444; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer;">Next ⏭️</button>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <span style="font-size: 12px; color: #ccc;">Volume:</span>
                    <input type="range" id="volumeSlider" min="0" max="100" value="50" style="flex: 1; margin: 0 10px;">
                    <button id="downloadCurrentBtn" style="background: #28a745; color: white; border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer; font-size: 12px;">⬇️ Download</button>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 12px; color: #ccc;">Speed:</span>
                    <select id="playbackSpeed" style="background: #333; color: white; border: 1px solid #555; padding: 4px; border-radius: 4px; margin-left: 10px;">
                        <option value="0.5">0.5x</option>
                        <option value="0.75">0.75x</option>
                        <option value="1" selected>1x</option>
                        <option value="1.25">1.25x</option>
                        <option value="1.5">1.5x</option>
                        <option value="2">2x</option>
                    </select>
                    <button id="downloadAllBtn" style="background: #6f42c1; color: white; border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer; font-size: 12px; margin-left: auto;">⬇️ Download All</button>
                </div>
            </div>

            <div style="padding: 10px 15px; border-bottom: 1px solid #333; font-size: 12px; color: #ccc; flex-shrink: 0;">
                Detected: <span id="audioCount">0</span> files | Last scan: <span id="lastScan">-</span>
            </div>

            <div id="trackList" style="overflow-y: auto; flex-grow: 1;"></div>
        `;

        document.body.appendChild(audioPlayer);
        setupPlayerControls();
    }

    // Setup enhanced player controls
    function setupPlayerControls() {
        const audioElement = document.getElementById('mainAudioElement');
        const playPauseBtn = document.getElementById('playPauseBtn');
        const stopBtn = document.getElementById('stopBtn');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const volumeSlider = document.getElementById('volumeSlider');
        const speedSelect = document.getElementById('playbackSpeed');
        const downloadBtn = document.getElementById('downloadCurrentBtn');
        const downloadAllBtn = document.getElementById('downloadAllBtn');
        const refreshBtn = document.getElementById('refreshDetection');
        const clearBtn = document.getElementById('clearAll');
        const closeBtn = document.getElementById('closeAudioPlayer');
        const openInNewTabBtn = document.getElementById('openInNewTab');

        audioElement.volume = 0.5;

        playPauseBtn.addEventListener('click', async () => {
            if (!currentAudio) return;
            try {
                if (audioElement.paused) {
                    await audioElement.play();
                } else {
                    audioElement.pause();
                }
            } catch (error) {
                console.error('Playback error:', error);
                playPauseBtn.innerHTML = '❌ Error';
                setTimeout(() => playPauseBtn.innerHTML = '▶️ Play', 1500);
            }
        });

        stopBtn.addEventListener('click', () => {
            audioElement.pause();
            audioElement.currentTime = 0;
        });

        prevBtn.addEventListener('click', () => {
            if (audioArray.length > 0) {
                currentIndex = (currentIndex - 1 + audioArray.length) % audioArray.length;
                loadTrack(currentIndex, !audioElement.paused);
            }
        });

        nextBtn.addEventListener('click', () => {
            if (audioArray.length > 0) {
                currentIndex = (currentIndex + 1) % audioArray.length;
                loadTrack(currentIndex, !audioElement.paused);
            }
        });

        volumeSlider.addEventListener('input', (e) => {
            audioElement.volume = e.target.value / 100;
        });

        speedSelect.addEventListener('change', (e) => {
            audioElement.playbackRate = parseFloat(e.target.value);
        });

        downloadBtn.addEventListener('click', () => {
            if (currentAudio) {
                const audioInfo = audioFiles.get(currentAudio);
                downloadAudio(currentAudio, audioInfo?.title || 'audio');
            }
        });

        downloadAllBtn.addEventListener('click', downloadAllAudio);

        refreshBtn.addEventListener('click', () => {
            forceDetection();
            refreshBtn.innerHTML = '✅ Done';
            setTimeout(() => refreshBtn.innerHTML = '🔄 Scan', 1200);
        });

        clearBtn.addEventListener('click', () => {
            audioFiles.clear();
            audioArray = [];
            currentAudio = null;
            currentIndex = 0;
            const audioElement = document.getElementById('mainAudioElement');
            audioElement.src = '';
            updateButtonBadge();
            updateTrackList();
        });

        // Close btn (top-right)
        closeBtn.addEventListener('click', () => {
            audioPlayer.style.display = 'none';
            isExpanded = false;
        });

        // NEW: Open in New Tab snapshot
        openInNewTabBtn.addEventListener('click', openAudioInterfaceInNewTab);



       audioElement.addEventListener('play', () => playPauseBtn.innerHTML = '⏸️ Pause');
        audioElement.addEventListener('pause', () => playPauseBtn.innerHTML = '▶️ Play');
        audioElement.addEventListener('ended', () => {
            if (audioArray.length > 1) {
                nextBtn.click();
            } else {
                 playPauseBtn.innerHTML = '▶️ Play';
            }
        });
        audioElement.addEventListener('error', (e) => {
            console.error('Audio error:', e);
            document.getElementById('trackTitle').textContent = '❌ Error loading track';
        });
    }

    // NEW: Open the floating UI snapshot in a separate tab
    function openInNewTab() {
        const w = window.open('', '_blank');
        if (!w) return;

        const files = Array.from(audioFiles.values());
        const safe = (s) => String(s || '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
        const rows = files.map((f, i) => `
            <tr>
                <td>${i+1}</td>
                <td>${safe(f.title)}</td>
                <td>${safe(f.source)}</td>
                <td>${safe(f.size)}</td>
                <td>${safe(f.duration)}</td>
                <td style="max-width:420px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${safe(f.url)}">
                    <a href="${safe(f.url)}" target="_blank">${safe(f.url)}</a>
                </td>
                <td>
                    <audio controls preload="none" src="${safe(f.url)}" style="width:240px"></audio>
                </td>
                <td><a href="${safe(f.url)}" download="${safe(f.title)}" style="text-decoration:none;">⬇️</a></td>
            </tr>
        `).join('');

        w.document.write(`
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Detected Audio Snapshot</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
body{font-family:system-ui,Segoe UI,Roboto,Arial,sans-serif;background:#0f1115;color:#e6e6e6;margin:0;padding:16px;}
h1{font-size:18px;margin:0 0 12px;}
.card{background:#141821;border:1px solid #222739;border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,.35);padding:12px;}
table{width:100%;border-collapse:collapse;font-size:13px;}
th,td{border-bottom:1px solid #222739;padding:8px;vertical-align:middle;}
th{position:sticky;top:0;background:#141821;z-index:1;text-align:left;}
a{color:#6ab8ff;}
small{color:#8aa0b3}
</style>
</head>
<body>
<div class="card">
  <h1>Detected Audio Files <small>(${files.length})</small></h1>
  <table>
    <thead>
      <tr>
        <th>#</th><th>Title</th><th>Source</th><th>Size</th><th>Duration</th><th>URL</th><th>Play</th><th>DL</th>
      </tr>
    </thead>
    <tbody>
      ${rows || '<tr><td colspan="8" style="text-align:center;color:#8aa0b3;padding:24px;">No audio detected yet.</td></tr>'}
    </tbody>
  </table>
  <p style="margin-top:10px;color:#8aa0b3">This is a snapshot of what was detected on the originating tab at the moment you clicked "Open in New Tab".</p>
</div>
</body>
</html>`);
        w.document.close();
    }

    // Format duration
    function formatDuration(seconds) {
        if (isNaN(seconds) || seconds === Infinity) return 'Live';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    // Load track with enhanced info
    function loadTrack(index, shouldPlay = false) {
        if (index < 0 || index >= audioArray.length) return;

        currentIndex = index;
        currentAudio = audioArray[index];
        const audioInfo = audioFiles.get(currentAudio);

        const audioElement = document.getElementById('mainAudioElement');
        const trackTitle = document.getElementById('trackTitle');
        const trackSource = document.getElementById('trackSource');
        const trackUrl = document.getElementById('trackUrl');

        audioElement.src = currentAudio;
        trackTitle.textContent = audioInfo.title;
        trackSource.textContent = `Source: ${audioInfo.source} | Size: ${audioInfo.size} | Duration: ${audioInfo.duration}`;
        trackUrl.textContent = currentAudio;

        audioElement.addEventListener('loadedmetadata', () => {
            if (audioInfo.duration === 'Unknown' && audioElement.duration) {
                audioInfo.duration = formatDuration(audioElement.duration);
                trackSource.textContent = `Source: ${audioInfo.source} | Size: ${audioInfo.size} | Duration: ${audioInfo.duration}`;
            }
        }, { once: true });

        if (shouldPlay) {
            audioElement.play().catch(e => console.error("Autoplay failed:", e));
        }

        updateTrackListHighlight();
    }

    // Sort priority
    function getSortPriority(url, audioInfo) {
        const lowerUrl = url.toLowerCase();
        const source = (audioInfo.source || '').toLowerCase();
        if (primaryAudioExtensions.some(ext => lowerUrl.endsWith(ext))) return 1;
        if (streamExtensions.some(ext => lowerUrl.endsWith(ext))) return 2;
        if (lowerUrl.startsWith('blob:')) return 3;
        if (['.webm', '.mp4', '.mov'].some(ext => lowerUrl.endsWith(ext))) return 4;
        if (lowerUrl.includes('audio') || lowerUrl.includes('stream') || lowerUrl.includes('music')) return 5;
        if (source.includes('embed') || source.includes('spotify') || source.includes('soundcloud') || source.includes('youtube')) return 6;
        return 7;
    }

    // Update track list (sorted)
    function updateTrackList() {
        const trackList = document.getElementById('trackList');
        const audioCount = document.getElementById('audioCount');
        const lastScan = document.getElementById('lastScan');

        if (!trackList) return;

        audioArray = Array.from(audioFiles.keys()).sort((urlA, urlB) => {
            const infoA = audioFiles.get(urlA);
            const infoB = audioFiles.get(urlB);
            const priorityA = getSortPriority(urlA, infoA);
            const priorityB = getSortPriority(urlB, infoB);
            if (priorityA !== priorityB) return priorityA - priorityB;
            return infoB.detected - infoA.detected;
        });

        audioCount.textContent = audioArray.length;
        lastScan.textContent = new Date().toLocaleTimeString();
        trackList.innerHTML = '';

        if (audioArray.length === 0) {
            trackList.innerHTML = '<div style="padding: 20px; text-align: center; color: #666;">No audio files detected</div>';
            document.getElementById('trackTitle').textContent = 'No track selected';
            document.getElementById('trackSource').textContent = '';
            document.getElementById('trackUrl').textContent = '';
            return;
        }

        audioArray.forEach((url, index) => {
            const audioInfo = audioFiles.get(url);
            const trackItem = document.createElement('div');
            trackItem.style.cssText = `
                padding: 12px 15px;
                border-bottom: 1px solid #333;
                cursor: pointer;
                transition: background-color 0.3s;
            `;

            trackItem.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 5px;">
                    <div style="font-size: 13px; font-weight: bold; color: #ccc; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${index + 1}. ${audioInfo.title}</div>
                    <button class="track-download" data-url="${url}" data-title="${audioInfo.title}" style="background: #28a745; color: white; border: none; padding: 2px 6px; border-radius: 3px; cursor: pointer; font-size: 10px; margin-left: 10px;">⬇️</button>
                </div>
                <div style="font-size: 11px; color: #4CAF50; margin-bottom: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                    ${audioInfo.source} | ${audioInfo.size} | ${audioInfo.duration} | ${audioInfo.detected.toLocaleTimeString()}
                </div>
                <div style="font-size: 10px; color: #888; word-break: break-all; max-height: 30px; overflow: hidden;">
                    ${url}
                </div>
            `;

            trackItem.addEventListener('click', (e) => {
                if (!e.target.classList.contains('track-download')) {
                    loadTrack(index, true);
                }
            });

            trackItem.addEventListener('mouseenter', () => {
                if (index !== currentIndex) trackItem.style.backgroundColor = 'rgba(255,255,255,0.08)';
            });

            trackItem.addEventListener('mouseleave', () => {
                if (index !== currentIndex) trackItem.style.backgroundColor = 'transparent';
            });

            trackList.appendChild(trackItem);
        });

        trackList.querySelectorAll('.track-download').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                downloadAudio(btn.getAttribute('data-url'), btn.getAttribute('data-title'));
            });
        });

        if (!currentAudio || !audioArray.includes(currentAudio)) {
            loadTrack(0);
        } else {
            currentIndex = audioArray.indexOf(currentAudio);
            updateTrackListHighlight();
        }
    }

    // Update highlighting
    function updateTrackListHighlight() {
        const trackList = document.getElementById('trackList');
        if (!trackList) return;
        Array.from(trackList.children).forEach((item, index) => {
            const titleDiv = item.querySelector('div div');
            if (index === currentIndex) {
                item.style.backgroundColor = 'rgba(0, 123, 255, 0.3)';
                if (titleDiv) titleDiv.style.color = '#fff';
            } else {
                item.style.backgroundColor = 'transparent';
                if (titleDiv) titleDiv.style.color = '#ccc';
            }
        });
    }

    // Toggle player
    function toggleAudioPlayer() {
        if (!audioPlayer) {
            createAudioPlayer();
        }
        if (isExpanded) {
            audioPlayer.style.display = 'none';
            isExpanded = false;
        } else {
            audioPlayer.style.display = 'flex';
            isExpanded = true;
            updateTrackList();
        }
    }













function openAudioInterfaceInNewTab() {
    const w = window.open('', '_blank');
    if (!w) return;

    const audioFilesData = JSON.stringify(Array.from(audioFiles.entries()));

    w.document.write(`
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Audio Player</title>
<style>
    body { margin:0; padding:20px; font-family: Arial, sans-serif; background: #f9f9f9; color: #222; }
    h1 { font-size: 22px; margin-bottom: 20px; }
    .controls, .track-info { margin-bottom: 15px; }
    button { padding:6px 12px; margin-right:6px; cursor:pointer; border-radius:4px; border:1px solid #aaa; background:#fff; }
    button:hover { background:#eee; }
    audio { width:100%; margin-bottom:10px; }
    #trackList { border-top:1px solid #ccc; }
    .trackItem { padding:10px 0; border-bottom:1px solid #ccc; display:flex; justify-content: space-between; align-items: center; }
    .trackItem div { flex:1; }
    @media(max-width:480px) { body{padding:10px;} h1{font-size:18px;} }
</style>
</head>
<body>
<h1>Detected Audio Files</h1>

<div class="track-info">
    <div id="trackTitle">No track selected</div>
    <div id="trackSource" style="font-size:14px;color:#555;"></div>
    <div id="trackUrl" style="font-size:12px;color:#888;word-break:break-all;"></div>
</div>

<div class="controls">
    <audio id="mainAudioElement" controls preload="metadata"></audio>
    <br>
    <button id="prevBtn">Prev ⏮️</button>
    <button id="playPauseBtn">Play ▶️</button>
    <button id="stopBtn">Stop ⏹️</button>
    <button id="nextBtn">Next ⏭️</button>
    <br><br>
    <label>Volume: <input type="range" id="volumeSlider" min="0" max="100" value="50"></label>
    <label>Speed:
        <select id="playbackSpeed">
            <option value="0.5">0.5x</option>
            <option value="0.75">0.75x</option>
            <option value="1" selected>1x</option>
            <option value="1.25">1.25x</option>
            <option value="1.5">1.5x</option>
            <option value="2">2x</option>
        </select>
    </label>
    <br><br>
    <button id="downloadCurrentBtn">Download Current ⬇️</button>
    <button id="downloadAllBtn">Download All ⬇️</button>
</div>

<div id="trackList"></div>

<script>
    const audioFiles = new Map(${audioFilesData});
    let audioArray = Array.from(audioFiles.keys());
    let currentIndex = 0;
    let currentAudio = audioArray[0];

    const audioElement = document.getElementById('mainAudioElement');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const stopBtn = document.getElementById('stopBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const volumeSlider = document.getElementById('volumeSlider');
    const speedSelect = document.getElementById('playbackSpeed');
    const downloadBtn = document.getElementById('downloadCurrentBtn');
    const downloadAllBtn = document.getElementById('downloadAllBtn');
    const trackTitle = document.getElementById('trackTitle');
    const trackSource = document.getElementById('trackSource');
    const trackUrl = document.getElementById('trackUrl');
    const trackList = document.getElementById('trackList');

    function loadTrack(index, shouldPlay=false){
        if(index<0||index>=audioArray.length)return;
        currentIndex=index;
        currentAudio=audioArray[index];
        const info=audioFiles.get(currentAudio);
        audioElement.src=currentAudio;
        trackTitle.textContent=info.title;
        trackSource.textContent=\`Source: \${info.source} | Size: \${info.size} | Duration: \${info.duration}\`;
        trackUrl.textContent=currentAudio;
        if(shouldPlay) audioElement.play().catch(()=>{});
        highlightTrack();
    }

    function highlightTrack(){
        Array.from(trackList.children).forEach((item,i)=>{
            item.style.background=i===currentIndex?'#ddeeff':'#fff';
        });
    }

    function updateTrackList(){
        trackList.innerHTML='';
        audioArray.forEach((url,i)=>{
            const info=audioFiles.get(url);
            const item=document.createElement('div');
            item.className='trackItem';
            item.innerHTML=\`
                <div>\${i+1}. \${info.title} (\${info.source})</div>
                <button>⬇️</button>
            \`;
            item.addEventListener('click',()=>loadTrack(i,true));
            item.querySelector('button').addEventListener('click',e=>{
                e.stopPropagation();
                const a=document.createElement('a');
                a.href=url;
                a.download=info.title;
                a.click();
            });
            trackList.appendChild(item);
        });
    }

    playPauseBtn.addEventListener('click',()=>{
        if(audioElement.paused) audioElement.play(); else audioElement.pause();
    });
    stopBtn.addEventListener('click',()=>{audioElement.pause(); audioElement.currentTime=0;});
    prevBtn.addEventListener('click',()=>{currentIndex=(currentIndex-1+audioArray.length)%audioArray.length; loadTrack(currentIndex,true);});
    nextBtn.addEventListener('click',()=>{currentIndex=(currentIndex+1)%audioArray.length; loadTrack(currentIndex,true);});
    volumeSlider.addEventListener('input',e=>audioElement.volume=e.target.value/100);
    speedSelect.addEventListener('change',e=>audioElement.playbackRate=parseFloat(e.target.value));
    downloadBtn.addEventListener('click',()=>{const info=audioFiles.get(currentAudio); const a=document.createElement('a'); a.href=currentAudio; a.download=info.title; a.click();});
    downloadAllBtn.addEventListener('click',()=>{audioArray.forEach(url=>{const info=audioFiles.get(url); const a=document.createElement('a'); a.href=url; a.download=info.title; a.click();});});

    updateTrackList();
    loadTrack(0);
</script>

</body>
</html>
    `);

    w.document.close();
}









    // Enhanced download function
    async function downloadAudio(url, filename) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Fetch failed with status ${response.status}`);
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = blobUrl;
            const safeFilename = (filename || 'audio').replace(/[\\/:*?"<>|]/g, '_');
            const extension = url.split('.').pop().split('?')[0] || 'mp3';
            link.download = safeFilename.endsWith('.' + extension) ? safeFilename : `${safeFilename}.${extension}`;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
        } catch (fetchError) {
            console.error('Fetch download failed, falling back to new tab:', fetchError);
            window.open(url, '_blank');
        }
    }

    // Download all audio files
    async function downloadAllAudio() {
        const downloadAllBtn = document.getElementById('downloadAllBtn');
        const originalText = downloadAllBtn.innerHTML;

        let count = 0;
        for (const url of audioArray) {
            const audioInfo = audioFiles.get(url);
            try {
                downloadAllBtn.innerHTML = `⬇️ ${++count}/${audioFiles.size}`;
                await downloadAudio(url, audioInfo.title);
                await new Promise(resolve => setTimeout(resolve, 400));
            } catch (error) {
                console.error('Failed to download:', url, error);
            }
        }

        downloadAllBtn.innerHTML = '✅ Done';
        setTimeout(() => downloadAllBtn.innerHTML = originalText, 1200);
    }

    // ADVANCED DETECTION METHODS

    // 1. Intercept Fetch API
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        const url = typeof args[0] === 'string' ? args[0] : args[0]?.url;
        if (url) {
            interceptAudioRequest(url, 'Fetch API');
        }
        return originalFetch.apply(this, args).then(response => {
            if (response.ok && url) {
                const contentType = response.headers.get('content-type') || '';
                const contentLength = response.headers.get('content-length') || 'Unknown';
                if (isAudioContent(url, contentType)) {
                    addAudioFile(url, {
                        source: 'Fetch API',
                        size: formatFileSize(contentLength),
                        title: extractFilename(url)
                    });
                }
            }
            return response.clone();
        });
    };

    // 2. Intercept XMLHttpRequest
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, ...args) {
        this._audioDetectorUrl = url;
        return originalOpen.apply(this, [method, url, ...args]);
    };
    const originalSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function(...args) {
        this.addEventListener('load', () => {
            if (this.status >= 200 && this.status < 300 && this._audioDetectorUrl) {
                const contentType = this.getResponseHeader('content-type') || '';
                const contentLength = this.getResponseHeader('content-length') || 'Unknown';
                if (isAudioContent(this._audioDetectorUrl, contentType)) {
                    addAudioFile(this._audioDetectorUrl, {
                        source: 'XMLHttpRequest',
                        size: formatFileSize(contentLength),
                        title: extractFilename(this._audioDetectorUrl)
                    });
                }
            }
        });
        return originalSend.apply(this, args);
    };

    // 3. Monitor Audio/Video elements
    function monitorMediaElements() {
        document.querySelectorAll('audio, video').forEach(element => {
            extractMediaSources(element);
            const observer = new MutationObserver(() => extractMediaSources(element));
            observer.observe(element, { attributes: true, attributeFilter: ['src'] });
            element.addEventListener('loadstart', () => extractMediaSources(element));
            element.addEventListener('canplay', () => extractMediaSources(element));
        });
    }

    // 4. Extract media sources
    function extractMediaSources(element) {
        const tagName = element.tagName.toLowerCase();
        if (element.src && !element.src.startsWith('blob:')) {
            addAudioFile(element.src, {
                source: `${tagName} element`,
                title: element.title || element.getAttribute('alt') || extractFilename(element.src)
            });
        }
        element.querySelectorAll('source').forEach(source => {
            if (source.src) {
                addAudioFile(source.src, {
                    source: `${tagName} source`,
                    title: source.title || extractFilename(source.src)
                });
            }
        });
    }

    // 5. Intercept Web Audio API
    function interceptWebAudio() {
        if (!window.AudioContext && !window.webkitAudioContext) return;
        const OriginalAudioContext = window.AudioContext || window.webkitAudioContext;
        const newAudioContext = function(...args) {
            const context = new OriginalAudioContext(...args);
            const originalDecode = context.decodeAudioData;
            context.decodeAudioData = function(buffer, ...rest) {
                return originalDecode.call(this, buffer, ...rest);
            };
            return context;
        };
        window.AudioContext = window.webkitAudioContext = newAudioContext;
    }

    // 6. Monitor CSS and background audio
    function monitorCSSAudio() {
        const allElements = document.querySelectorAll('*');
        allElements.forEach(element => {
            const style = window.getComputedStyle(element);
            const bgImage = style.backgroundImage;
            if (bgImage && bgImage !== 'none') {
                const urls = bgImage.match(/url\(["']?([^"')]+)["']?\)/g);
                if (urls) {
                    urls.forEach(urlMatch => {
                        const url = urlMatch.match(/url\(["']?([^"')]+)["']?\)/)[1];
                        if (isAudioUrl(url)) {
                            addAudioFile(url, { source: 'CSS Background', title: extractFilename(url) });
                        }
                    });
                }
            }
        });
    }

    // 7. Detect streaming protocols
    function detectStreamingAudio() {
        if (window.Hls && window.Hls.prototype && window.Hls.prototype.loadSource) {
            const originalLoadSource = window.Hls.prototype.loadSource;
            window.Hls.prototype.loadSource = function(url) {
                if (url) {
                    addAudioFile(url, { source: 'HLS Stream', title: extractFilename(url) });
                }
                return originalLoadSource.call(this, url);
            };
        }
        if (window.dashjs && window.dashjs.MediaPlayer && window.dashjs.MediaPlayer.prototype && window.dashjs.MediaPlayer.prototype.initialize) {
            const originalInitialize = window.dashjs.MediaPlayer.prototype.initialize;
            window.dashjs.MediaPlayer.prototype.initialize = function(view, source, autoPlay) {
                if (source) {
                    addAudioFile(source, { source: 'DASH Stream', title: extractFilename(source) });
                }
                return originalInitialize.call(this, view, source, autoPlay);
            };
        }
    }

    // 8. Monitor iframe audio
    function monitorIframeAudio() {
        document.querySelectorAll('iframe').forEach(iframe => {
            try {
                if (iframe.contentDocument) {
                    iframe.contentDocument.querySelectorAll('audio, video').forEach(element => {
                        extractMediaSources(element);
                    });
                }
            } catch (e) { /* Cross-origin */ }
        });
    }

    // Helper functions
    function interceptAudioRequest(url, source) {
        if (isAudioUrl(url) && !interceptedRequests.has(url)) {
            interceptedRequests.add(url);
            setTimeout(() => {
                fetch(url, { method: 'HEAD' }).then(response => {
                    const contentType = response.headers.get('content-type') || '';
                    const contentLength = response.headers.get('content-length') || 'Unknown';
                    if (isAudioContent(url, contentType)) {
                        addAudioFile(url, {
                            source: source,
                            size: formatFileSize(contentLength),
                            title: extractFilename(url)
                        });
                    }
                }).catch(() => {
                    addAudioFile(url, { source: source, title: extractFilename(url) });
                });
            }, 200);
        }
    }

    function isAudioUrl(url) {
        if (!url || typeof url !== 'string') return false;
        const lowerUrl = url.toLowerCase().split('?')[0];
        return audioExtensions.some(ext => lowerUrl.endsWith(ext));
    }

    function isAudioContent(url, contentType) {
        return isAudioUrl(url) ||
               audioMimeTypes.some(mime => (contentType || '').toLowerCase().includes(mime));
    }

    function formatFileSize(bytes) {
        if (bytes === 'Unknown' || !bytes) return 'Unknown';
        const size = parseInt(bytes);
        if (isNaN(size) || size === 0) return 'Unknown';
        const units = ['B', 'KB', 'MB', 'GB'];
        let index = 0;
        let value = size;
        while (value >= 1024 && index < units.length - 1) {
            value /= 1024;
            index++;
        }
        return `${value.toFixed(1)} ${units[index]}`;
    }

    // 9. Monitor dynamic content and SPA routing
    function monitorDynamicContent() {
        const originalPushState = history.pushState;
        history.pushState = function(...args) {
            originalPushState.apply(this, args);
            setTimeout(forceDetection, 500);
        };
        const originalReplaceState = history.replaceState;
        history.replaceState = function(...args) {
            originalReplaceState.apply(this, args);
            setTimeout(forceDetection, 500);
        };
        window.addEventListener('popstate', () => setTimeout(forceDetection, 500));
    }

    // 10. Deep DOM scanning for embedded players
    function scanEmbeddedPlayers() {
        document.querySelectorAll('iframe[src*="spotify"], iframe[src*="soundcloud"], iframe[src*="youtube"], iframe[src*="bandcamp"]').forEach(iframe => {
            const src = iframe.src;
            let sourceName = 'Embed';
            if (src.includes('spotify')) sourceName = 'Spotify Embed';
            else if (src.includes('soundcloud')) sourceName = 'SoundCloud Embed';
            else if (src.includes('youtube')) sourceName = 'YouTube Embed';
            else if (src.includes('bandcamp')) sourceName = 'Bandcamp Embed';
            addAudioFile(src, { source: sourceName, title: iframe.title || sourceName, size: 'Stream' });
        });
    }

    // 11. Monitor JavaScript variables and objects
    function scanJavaScriptVariables() {
        // Intentionally minimal; avoid heavy scans.
    }

    // 12. Network monitoring using Performance API
    function monitorNetworkRequests() {
        try {
            const observer = new PerformanceObserver((list) => {
                list.getEntriesByType('resource').forEach(entry => {
                    if (entry.initiatorType !== 'xmlhttprequest' && entry.initiatorType !== 'fetch') {
                        if (isAudioUrl(entry.name)) {
                            addAudioFile(entry.name, {
                                source: 'Network Monitor',
                                title: extractFilename(entry.name),
                                size: entry.transferSize ? formatFileSize(entry.transferSize) : 'Unknown'
                            });
                        }
                    }
                });
            });
            observer.observe({ type: 'resource', buffered: true });
        } catch (e) {
            // Not available
        }
    }

    // 13. Blob URL detection
    function monitorBlobUrls() {
        const originalCreateObjectURL = URL.createObjectURL;
        URL.createObjectURL = function(object) {
            const url = originalCreateObjectURL.call(this, object);
            if (object instanceof Blob && object.type && audioMimeTypes.some(mime => object.type.startsWith(mime.replace('/','')))) {
                addAudioFile(url, {
                    source: 'Blob URL',
                    title: `Blob Audio (${object.type})`,
                    size: formatFileSize(object.size)
                });
            }
            return url;
        };
    }

    // 14. Streaming libs hook (ensure on late load too)
    function lateStreamingHooks() {
        detectStreamingAudio();
        const _define = Object.defineProperty;
        try {
            _define(window, 'Hls', {
                set(v){ this._hlsRef = v; detectStreamingAudio(); },
                get(){ return this._hlsRef; }
            });
        } catch {}
        try {
            _define(window, 'dashjs', {
                set(v){ this._dashRef = v; detectStreamingAudio(); },
                get(){ return this._dashRef; }
            });
        } catch {}
    }

    // Force comprehensive detection
    function forceDetection() {
        // console.log('🔍 Running comprehensive audio detection...');
        monitorMediaElements();
        scanEmbeddedPlayers();
        monitorCSSAudio();
        monitorIframeAudio();
        detectStreamingAudio();
        // console.log(`🎵 Detection complete. Found ${audioFiles.size} audio files.`);
    }

    // Initialize all detection methods
    function initializeAdvancedDetection() {
        // console.log('🚀 Initializing advanced audio detection...');
        interceptWebAudio();
        monitorBlobUrls();
        monitorNetworkRequests();
        monitorDynamicContent();
        lateStreamingHooks();

        const observer = new MutationObserver(() => {
            clearTimeout(window.audioDetectorDebounce);
            window.audioDetectorDebounce = setTimeout(forceDetection, 400);
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['src', 'href']
        });

        setTimeout(forceDetection, 1000);
    }

    // Initialize everything
    function init() {
        createFloatingButton();
        initializeAdvancedDetection();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Global access for debugging
    window.audioDetector = {
        getDetectedFiles: () => Array.from(audioFiles.values()),
        forceDetection,
        clearFiles: () => {
            audioFiles.clear();
            updateButtonBadge();
            if (isExpanded) updateTrackList();
        }
    };

})();