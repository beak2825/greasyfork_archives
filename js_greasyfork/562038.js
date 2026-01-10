// ==UserScript==
// @name         Escort Directory Video Search v7.1
// @namespace    http://tampermonkey.net/
// @version      7.1
// @description  Side panel video browser with full profile 
// @license MIT 
// @author       insomniakin
// @match        https://escortbabylon.net/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/562038/Escort%20Directory%20Video%20Search%20v71.user.js
// @updateURL https://update.greasyfork.org/scripts/562038/Escort%20Directory%20Video%20Search%20v71.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[VideoSearch v7.1] Starting...');

    GM_addStyle(`
        * {
            box-sizing: border-box;
        }

        body.video-feed-active {
            margin-right: 450px;
        }

        #video-feed-panel {
            position: fixed;
            top: 0;
            right: -450px;
            width: 450px;
            height: 100vh;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            z-index: 10000;
            transition: right 0.3s ease;
            display: flex;
            flex-direction: column;
            box-shadow: -5px 0 20px rgba(0,0,0,0.5);
        }

        #video-feed-panel.active {
            right: 0;
        }

        .panel-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 15px 20px;
            color: white;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-shrink: 0;
        }

        .panel-header h3 {
            margin: 0;
            font-size: 18px;
        }

        .close-panel {
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            transition: all 0.2s;
        }

        .close-panel:hover {
            background: rgba(255,255,255,0.3);
            transform: scale(1.1);
        }

        .panel-content {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
        }

        .profile-card {
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(102, 126, 234, 0.3);
            border-radius: 10px;
            padding: 20px;
        }

        .video-thumbnail-box {
            width: 100%;
            height: 280px;
            background: #000;
            border-radius: 8px;
            margin-bottom: 15px;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .video-thumbnail {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
        }

        .thumbnail-placeholder {
            color: #666;
            font-size: 12px;
            text-align: center;
        }

        .profile-info {
            color: white;
        }

        .info-row {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid rgba(255,255,255,0.1);
            font-size: 13px;
        }

        .info-label {
            color: #ffd700;
            font-weight: 700;
        }

        .info-value {
            color: #fff;
            font-weight: 600;
        }

        .action-buttons {
            display: flex;
            gap: 10px;
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid rgba(255,255,255,0.1);
        }

        .action-btn {
            flex: 1;
            padding: 12px;
            border: none;
            border-radius: 6px;
            color: white;
            font-weight: 600;
            cursor: pointer;
            text-decoration: none;
            text-align: center;
            font-size: 12px;
            transition: all 0.2s;
        }

        .action-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        }

        .btn-reviews {
            background: #667eea;
        }

        .btn-reviews:hover {
            background: #5568d3;
        }

        .btn-videos {
            background: #f093fb;
        }

        .btn-videos:hover {
            background: #d678e6;
        }

        .nav-controls {
            display: flex;
            gap: 10px;
            padding: 15px 20px;
            border-top: 1px solid rgba(255,255,255,0.1);
            flex-shrink: 0;
        }

        .nav-btn {
            flex: 1;
            padding: 10px;
            background: rgba(102, 126, 234, 0.3);
            border: 1px solid rgba(102, 126, 234, 0.5);
            color: white;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.2s;
            font-size: 13px;
        }

        .nav-btn:hover:not(:disabled) {
            background: rgba(102, 126, 234, 0.5);
            transform: translateY(-2px);
        }

        .nav-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .counter-display {
            text-align: center;
            padding: 10px 0;
            color: #ffd700;
            font-weight: 700;
            font-size: 13px;
        }

        .open-panel-btn {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            z-index: 9999;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
            transition: all 0.2s;
        }

        .open-panel-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
        }

        .loading-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            gap: 15px;
            color: #999;
        }

        .spinner {
            border: 3px solid rgba(255,255,255,0.1);
            border-top: 3px solid #667eea;
            border-radius: 50%;
            width: 35px;
            height: 35px;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .error-state {
            color: #f093fb;
            text-align: center;
            padding: 20px;
        }

        ::-webkit-scrollbar {
            width: 8px;
        }

        ::-webkit-scrollbar-track {
            background: rgba(255,255,255,0.05);
        }

        ::-webkit-scrollbar-thumb {
            background: rgba(102, 126, 234, 0.5);
            border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: rgba(102, 126, 234, 0.7);
        }
    `);

    let videoProfiles = [];
    let currentIndex = 0;

    function createPanel() {
        const panel = document.createElement('div');
        panel.id = 'video-feed-panel';
        panel.innerHTML = `
            <div class="panel-header">
                <h3>🎥 Video Feed</h3>
                <button class="close-panel">✕</button>
            </div>
            <div class="panel-content" id="panel-content">
                <div class="loading-state">
                    <div class="spinner"></div>
                    <div>Loading profiles...</div>
                </div>
            </div>
            <div class="nav-controls">
                <button class="nav-btn" id="prev-btn">← Prev</button>
                <div class="counter-display" id="counter">0/0</div>
                <button class="nav-btn" id="next-btn">Next →</button>
            </div>
        `;
        document.body.appendChild(panel);

        panel.querySelector('.close-panel').onclick = closePanel;
        document.getElementById('prev-btn').onclick = () => showProfile(currentIndex - 1);
        document.getElementById('next-btn').onclick = () => showProfile(currentIndex + 1);
    }

    function createOpenButton() {
        const btn = document.createElement('button');
        btn.className = 'open-panel-btn';
        btn.innerHTML = '🎥 Video Feed';
        btn.onclick = openPanel;
        document.body.appendChild(btn);
    }

    function fetchProfileVideos(profileId) {
        return new Promise((resolve) => {
            const videoPageUrl = `https://escortbabylon.net/video_list/${profileId}`;
            
            GM_xmlhttpRequest({
                method: 'GET',
                url: videoPageUrl,
                timeout: 8000,
                onload: function(response) {
                    try {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, 'text/html');
                        
                        const videoLinks = doc.querySelectorAll('a[href*="/video_view/"]');
                        const videoCount = videoLinks.length;

                        let firstVideoUrl = null;
                        const firstVideoLink = doc.querySelector('a[href*="/video_view/"]');
                        if (firstVideoLink) {
                            const videoImg = firstVideoLink.querySelector('img');
                            if (videoImg && videoImg.src) {
                                firstVideoUrl = videoImg.src;
                            }
                        }

                        resolve({
                            profileId: profileId,
                            videoCount: videoCount,
                            firstVideoUrl: firstVideoUrl,
                            videoListUrl: videoPageUrl
                        });
                    } catch (e) {
                        resolve({
                            profileId: profileId,
                            videoCount: 0,
                            firstVideoUrl: null,
                            videoListUrl: videoPageUrl
                        });
                    }
                },
                onerror: function() {
                    resolve({
                        profileId: profileId,
                        videoCount: 0,
                        firstVideoUrl: null,
                        videoListUrl: videoPageUrl
                    });
                },
                ontimeout: function() {
                    resolve({
                        profileId: profileId,
                        videoCount: 0,
                        firstVideoUrl: null,
                        videoListUrl: videoPageUrl
                    });
                }
            });
        });
    }

    async function extractAndFetchVideos() {
        const thumbnails = document.querySelectorAll('.thumbnail');
        videoProfiles = [];

        console.log(`[VideoSearch v7.1] Found ${thumbnails.length} profiles`);

        let processed = 0;
        for (const thumb of thumbnails) {
            const link = thumb.querySelector('a[href*="/review_list/"]');
            if (!link) continue;

            const match = link.href.match(/review_list\/(\d+)/);
            if (!match) continue;

            const profileId = match[1];
            const videoData = await fetchProfileVideos(profileId);

            if (videoData.videoCount > 0) {
                videoProfiles.push(videoData);
            }

            processed++;
        }

        console.log(`[VideoSearch v7.1] Found ${videoProfiles.length} profiles with videos`);
    }

    function showProfile(index) {
        if (videoProfiles.length === 0) return;

        currentIndex = Math.max(0, Math.min(index, videoProfiles.length - 1));
        const profile = videoProfiles[currentIndex];

        const content = document.getElementById('panel-content');
        
        let thumbnailHTML = '';
        if (profile.firstVideoUrl) {
            thumbnailHTML = `<img src="${profile.firstVideoUrl}" class="video-thumbnail" alt="Video">`;
        } else {
            thumbnailHTML = '<div class="thumbnail-placeholder">📹 No preview available</div>';
        }

        content.innerHTML = `
            <div class="profile-card">
                <div class="video-thumbnail-box">
                    ${thumbnailHTML}
                </div>
                <div class="profile-info">
                    <div class="info-row">
                        <span class="info-label">📌 Profile ID:</span>
                        <span class="info-value">${profile.profileId}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">🎥 Videos:</span>
                        <span class="info-value">${profile.videoCount}</span>
                    </div>
                    <div class="action-buttons">
                        <a href="https://escortbabylon.net/review_list/${profile.profileId}" target="_blank" class="action-btn btn-reviews">👁️ Reviews</a>
                        <a href="${profile.videoListUrl}" target="_blank" class="action-btn btn-videos">🎬 Watch (${profile.videoCount})</a>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('counter').textContent = `${currentIndex + 1} / ${videoProfiles.length}`;
        document.getElementById('prev-btn').disabled = currentIndex === 0;
        document.getElementById('next-btn').disabled = currentIndex === videoProfiles.length - 1;
    }

    async function openPanel() {
        const panel = document.getElementById('video-feed-panel');
        document.body.classList.add('video-feed-active');
        panel.classList.add('active');

        await extractAndFetchVideos();

        if (videoProfiles.length === 0) {
            document.getElementById('panel-content').innerHTML = '<div class="error-state">❌ No profiles with videos found</div>';
            return;
        }

        showProfile(0);
        document.addEventListener('keydown', handleKeyboard);
    }

    function closePanel() {
        const panel = document.getElementById('video-feed-panel');
        document.body.classList.remove('video-feed-active');
        panel.classList.remove('active');
        document.removeEventListener('keydown', handleKeyboard);
    }

    function handleKeyboard(e) {
        if (e.key === 'ArrowRight') showProfile(currentIndex + 1);
        if (e.key === 'ArrowLeft') showProfile(currentIndex - 1);
        if (e.key === 'Escape') closePanel();
    }

    function init() {
        console.log('[VideoSearch v7.1] Initializing...');
        createPanel();
        createOpenButton();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
