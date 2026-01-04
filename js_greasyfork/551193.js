// ==UserScript==
// @name         Soundgasm Enhanced Player and Downloadeder
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Transform Soundgasm player with a modern interface, reliable download, and copyable tags.
// @author       Ifrit Raen
// @match        https://soundgasm.net/u/*/*
// @grant        none
// @run-at       document-ready
// @license       mit
// @downloadURL https://update.greasyfork.org/scripts/551193/Soundgasm%20Enhanced%20Player%20and%20Downloadeder.user.js
// @updateURL https://update.greasyfork.org/scripts/551193/Soundgasm%20Enhanced%20Player%20and%20Downloadeder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let audioUrl = '';
    let originalDescription = '';
    let extractedTags = [];
    let actualTitle = '';

    function init() {
        addCustomStyles();

        const checkForAudio = setInterval(() => {
            const audioElement = document.querySelector('audio');
            if (audioElement && audioElement.src) {
                clearInterval(checkForAudio);
                extractContentInfo();
                createEnhancedPlayer();
            }
        }, 500);
    }

    function extractContentInfo() {
        // Extract audio URL
        const audioElement = document.querySelector('audio');
        if (audioElement && audioElement.src) {
            audioUrl = audioElement.src;
        }

        // Extract actual title from the correct element
        const titleElement = document.querySelector('#jp_container_1 .jp-title');
        if (titleElement) {
            actualTitle = titleElement.textContent.trim();
        } else {
            actualTitle = document.title.replace(' : Soundgasm', '') || 'Audio Player';
        }

        // Extract description from the correct element
        const descriptionElement = document.querySelector('#jp_container_1 .jp-description');
        if (descriptionElement) {
            originalDescription = descriptionElement.textContent || descriptionElement.innerText || '';
        }

        // Extract tags from both title and description
        const titleTags = extractTags(actualTitle);
        const descriptionTags = extractTags(originalDescription);
        extractedTags = [...new Set([...titleTags, ...descriptionTags])];
    }

    function extractTags(text) {
        const tagRegex = /\[([^\]]+)\]/g;
        const tags = [];
        let match;
        while ((match = tagRegex.exec(text)) !== null) {
            tags.push(match[1].trim());
        }
        return tags;
    }

    function addCustomStyles() {
        const style = document.createElement('style');
        style.textContent = `
            * {
                box-sizing: border-box;
            }

            body {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
                font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important;
                margin: 0 !important;
                padding: 20px !important;
                min-height: 100vh !important;
                color: #ffffff !important;
                overflow-x: hidden !important;
            }

            audio {
                display: none !important;
            }

            .enhanced-player-container {
                max-width: 900px;
                margin: 0 auto;
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(25px);
                border-radius: 24px;
                padding: 40px;
                box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1);
            }

            @keyframes slideUp {
                from { opacity: 0; transform: translateY(50px); }
                to { opacity: 1; transform: translateY(0); }
            }

            .player-title {
                text-align: center;
                margin-bottom: 40px;
                padding-bottom: 24px;
                border-bottom: 2px solid rgba(255, 255, 255, 0.15);
            }

            .player-title h1 {
                font-size: 2.8em !important;
                font-weight: 700 !important;
                margin: 0 0 12px 0 !important;
                background: linear-gradient(135deg, #ffffff, #e0e0e0);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                text-shadow: none !important;
                line-height: 1.2 !important;
            }

            .player-subtitle {
                font-size: 1.3em;
                opacity: 0.85;
                margin: 0 !important;
                font-weight: 400;
            }

            /* Interactive Waveform */
            .waveform-container {
                height: 100px;
                background: rgba(0, 0, 0, 0.3);
                border-radius: 16px;
                margin: 30px 0 20px 0;
                padding: 15px;
                position: relative;
                overflow: hidden;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .waveform-container:hover {
                background: rgba(0, 0, 0, 0.4);
                transform: translateY(-2px);
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
            }

            .waveform {
                display: flex;
                align-items: center;
                justify-content: space-between;
                height: 100%;
                gap: 2px;
            }

            .wave-bar {
                width: 4px;
                background: linear-gradient(to top, #667eea, #764ba2);
                border-radius: 2px;
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                cursor: pointer;
                opacity: 0.6;
            }

            .wave-bar:hover {
                opacity: 1;
                transform: scaleY(1.1);
            }

            .wave-bar.active {
                background: linear-gradient(to top, #ff6b6b, #ffd93d);
                opacity: 1;
                box-shadow: 0 0 8px rgba(255, 107, 107, 0.5);
            }

            .wave-bar.playing {
                animation: pulse 1.5s ease-in-out infinite;
            }

            @keyframes pulse {
                0%, 100% { transform: scaleY(1); opacity: 0.8; }
                50% { transform: scaleY(1.3); opacity: 1; }
            }

            /* Seek Bar */
            .progress-section {
                margin: 20px 0 30px 0;
            }

            .progress-bar-container {
                position: relative;
                height: 8px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 12px;
                cursor: pointer;
                margin: 20px 0;
                overflow: hidden;
                box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
            }

            .progress-bar-container:hover {
                height: 10px;
                margin: 19px 0;
            }

            .progress-bar {
                height: 100%;
                background: linear-gradient(90deg, #667eea 0%, #764ba2 50%, #ff6b6b 100%);
                border-radius: 12px;
                width: 0%;
                transition: width 0.1s linear;
                position: relative;
                box-shadow: 0 0 12px rgba(102, 126, 234, 0.4);
            }

            .progress-bar::after {
                content: '';
                position: absolute;
                right: -8px;
                top: 50%;
                transform: translateY(-50%);
                width: 16px;
                height: 16px;
                background: white;
                border-radius: 50%;
                box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
                opacity: 0;
                transition: all 0.3s ease;
            }

            .progress-bar-container:hover .progress-bar::after {
                opacity: 1;
                transform: translateY(-50%) scale(1.2);
            }

            .time-display {
                display: flex;
                justify-content: space-between;
                font-size: 15px;
                font-weight: 500;
                opacity: 0.9;
                margin-top: 12px;
            }

            /* Control Buttons - Main Controls */
            .main-controls {
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 40px 0 30px 0;
                gap: 24px;
            }

            .control-btn {
                width: 64px;
                height: 64px;
                border-radius: 50%;
                border: none;
                background: rgba(255, 255, 255, 0.15);
                color: white;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                font-weight: 600;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                backdrop-filter: blur(10px);
                border: 2px solid rgba(255, 255, 255, 0.2);
                position: relative;
                overflow: hidden;
            }

            .control-btn::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                transition: left 0.5s ease;
            }

            .control-btn:hover::before {
                left: 100%;
            }

            .control-btn:hover {
                background: rgba(255, 255, 255, 0.25);
                transform: translateY(-4px) scale(1.05);
                box-shadow: 0 12px 25px rgba(0, 0, 0, 0.3);
                border-color: rgba(255, 255, 255, 0.4);
            }

            .control-btn:active {
                transform: translateY(-2px) scale(0.98);
            }

            .play-btn {
                width: 88px !important;
                height: 88px !important;
                font-size: 36px !important;
                background: linear-gradient(135deg, #667eea, #764ba2) !important;
                box-shadow: 0 15px 35px rgba(102, 126, 234, 0.4);
                border: 2px solid rgba(255, 255, 255, 0.3) !important;
            }

            .play-btn:hover {
                background: linear-gradient(135deg, #5a6fd8, #6b42a0) !important;
                box-shadow: 0 20px 40px rgba(102, 126, 234, 0.6);
                transform: translateY(-6px) scale(1.08) !important;
            }

            /* Secondary Controls */
            .secondary-controls {
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 20px 0 30px 0;
                gap: 20px;
            }

            .secondary-btn {
                width: 56px;
                height: 56px;
                border-radius: 50%;
                border: none;
                background: rgba(255, 255, 255, 0.1);
                color: white;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20px;
                transition: all 0.3s ease;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.15);
                opacity: 0.8;
            }

            .secondary-btn:hover {
                background: rgba(255, 255, 255, 0.2);
                transform: translateY(-3px);
                box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
                opacity: 1;
            }

            .btn-active {
                background: rgba(102, 126, 234, 0.7) !important;
                box-shadow: 0 0 15px rgba(102, 126, 234, 0.5);
                color: #ffffff !important;
            }

            /* Volume Section - More compact */
            .volume-section {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 15px;
                margin: 25px 0;
                padding: 15px 20px;
                background: rgba(0, 0, 0, 0.15);
                border-radius: 12px;
            }

            .volume-slider {
                width: 150px;
                height: 4px;
                border-radius: 2px;
                background: rgba(255, 255, 255, 0.2);
                outline: none;
                cursor: pointer;
                -webkit-appearance: none;
                position: relative;
            }

            .volume-slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                width: 16px;
                height: 16px;
                border-radius: 50%;
                background: linear-gradient(135deg, #667eea, #764ba2);
                cursor: pointer;
                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
                transition: all 0.3s ease;
            }

            .volume-slider::-webkit-slider-thumb:hover {
                transform: scale(1.2);
                box-shadow: 0 3px 10px rgba(102, 126, 234, 0.5);
            }

            .volume-icon {
                font-size: 20px;
                opacity: 0.9;
                cursor: pointer;
                transition: all 0.3s ease;
                min-width: 24px;
            }

            .volume-icon:hover {
                opacity: 1;
                transform: scale(1.1);
            }

            .volume-value {
                font-size: 14px;
                font-weight: 600;
                min-width: 40px;
                text-align: center;
                opacity: 0.8;
            }

            /* Tags Section - Below volume */
            .tags-container {
                margin: 25px 0;
                background: rgba(0, 0, 0, 0.15);
                border-radius: 16px;
                padding: 20px;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .tags-title {
                font-size: 1.2em;
                font-weight: 600;
                margin-bottom: 12px;
                color: #ffffff;
                opacity: 0.9;
            }

            .tags-list {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
            }

            .tag {
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                padding: 6px 14px;
                border-radius: 16px;
                font-size: 13px;
                font-weight: 500;
                border: 1px solid rgba(255, 255, 255, 0.2);
                transition: all 0.3s ease;
                cursor: pointer; /* MODIFIED: Indicate clickable tag */
                user-select: none; /* MODIFIED: Prevent text selection on click */
            }

            .tag:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
                background: linear-gradient(135deg, #5a6fd8, #6b42a0);
            }

            /* Description Section - Below tags */
            .description-container {
                margin: 25px 0;
                background: rgba(0, 0, 0, 0.15);
                border-radius: 16px;
                padding: 20px;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .description-title {
                font-size: 1.2em;
                font-weight: 600;
                margin-bottom: 12px;
                color: #ffffff;
                opacity: 0.9;
            }

            .description-content {
                background: rgba(255, 255, 255, 0.05);
                padding: 16px;
                border-radius: 8px;
                border: 1px solid rgba(255, 255, 255, 0.1);
                line-height: 1.6;
                font-size: 14px;
                max-height: 100px;
                overflow: hidden;
                transition: all 0.3s ease;
                position: relative;
            }

            .description-content.expanded {
                max-height: 500px;
                overflow-y: auto;
            }

            .description-content::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                height: 30px;
                background: linear-gradient(transparent, rgba(0, 0, 0, 0.3));
                pointer-events: none;
                opacity: 1;
                transition: opacity 0.3s ease;
            }

            .description-content.expanded::after {
                opacity: 0;
            }

            .expand-btn {
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 500;
                cursor: pointer;
                margin-top: 10px;
                transition: all 0.3s ease;
                border: 1px solid rgba(255, 255, 255, 0.2);
            }

            .expand-btn:hover {
                background: linear-gradient(135deg, #5a6fd8, #6b42a0);
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
            }

            /* Info Panel */
            .info-panel {
                background: rgba(0, 0, 0, 0.15);
                border-radius: 12px;
                padding: 20px;
                margin-top: 25px;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .info-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin: 8px 0;
                padding: 6px 0;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }

            .info-row:last-child {
                border-bottom: none;
            }

            .info-label {
                opacity: 0.8;
                font-weight: 500;
                font-size: 14px;
            }

            .info-value {
                font-weight: 600;
                font-size: 14px;
                color: #ffffff;
            }

            /* Responsive Design */
            @media (max-width: 768px) {
                body {
                    padding: 10px !important;
                }

                .enhanced-player-container {
                    padding: 25px;
                    margin: 5px;
                }

                .player-title h1 {
                    font-size: 2.2em !important;
                }

                .main-controls {
                    gap: 18px;
                }

                .control-btn {
                    width: 56px;
                    height: 56px;
                    font-size: 20px;
                }

                .play-btn {
                    width: 76px !important;
                    height: 76px !important;
                    font-size: 30px !important;
                }

                .secondary-controls {
                    gap: 15px;
                }

                .secondary-btn {
                    width: 48px;
                    height: 48px;
                    font-size: 18px;
                }

                .volume-section {
                    flex-direction: column;
                    gap: 12px;
                }

                .volume-slider {
                    width: 180px;
                }

                .tags-list {
                    justify-content: center;
                }
            }

            /* Loading States */
            .loading {
                opacity: 0.7;
                pointer-events: none;
            }

            .loading .wave-bar {
                animation: loadingWave 1.5s ease-in-out infinite;
            }

            @keyframes loadingWave {
                0%, 100% { transform: scaleY(0.3); opacity: 0.5; }
                50% { transform: scaleY(1); opacity: 1; }
            }

            /* Scrollbar */
            ::-webkit-scrollbar {
                width: 8px;
            }

            ::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 4px;
            }

            ::-webkit-scrollbar-thumb {
                background: linear-gradient(135deg, #667eea, #764ba2);
                border-radius: 4px;
            }

            ::-webkit-scrollbar-thumb:hover {
                background: linear-gradient(135deg, #5a6fd8, #6b42a0);
            }
        `;
        document.head.appendChild(style);
    }

    function createEnhancedPlayer() {
        if (!audioUrl) return;

        const userName = window.location.pathname.split('/')[2] || 'User';

        // Clean title and description from tags for display
        const cleanTitle = actualTitle.replace(/\[[^\]]+\]/g, '').trim();
        const cleanDescription = originalDescription.replace(/\[[^\]]+\]/g, '').trim();

        const playerContainer = document.createElement('div');
        playerContainer.className = 'enhanced-player-container';

        playerContainer.innerHTML = `
            <div class="player-title">
                <h1>${cleanTitle}</h1>
                <div class="player-subtitle">by ${userName}</div>
            </div>

            <div class="waveform-container" id="waveformContainer">
                <div class="waveform" id="waveform">
                    ${Array.from({length: 80}, (_, i) => `
                        <div class="wave-bar" data-index="${i}" style="height: ${Math.random() * 60 + 20}%;"></div>
                    `).join('')}
                </div>
            </div>

            <div class="progress-section">
                <div class="progress-bar-container" id="progressContainer">
                    <div class="progress-bar" id="progressBar"></div>
                </div>
                <div class="time-display">
                    <span id="currentTime">0:00</span>
                    <span id="duration">0:00</span>
                </div>
            </div>

            <div class="main-controls">
                <button class="control-btn" id="prevBtn" title="Previous (←)">⏮</button>
                <button class="control-btn play-btn" id="playPauseBtn" title="Play/Pause (Space)">▶</button>
                <button class="control-btn" id="nextBtn" title="Next (→)">⏭</button>
            </div>

            <div class="secondary-controls">
                <button class="secondary-btn" id="shuffleBtn" title="Shuffle">🔀</button>
                <button class="secondary-btn" id="repeatBtn" title="Repeat">🔁</button>
                <button class="secondary-btn" id="downloadBtn" title="Download Audio">⬇</button>
            </div>

            <div class="volume-section">
                <span class="volume-icon" id="volumeIcon">🔊</span>
                <input type="range" class="volume-slider" id="volumeSlider" min="0" max="100" value="50">
                <span class="volume-value" id="volumeValue">50%</span>
            </div>

            ${extractedTags.length > 0 ? `
            <div class="tags-container">
                <div class="tags-title">Tags</div>
                <div class="tags-list">
                    ${extractedTags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
            ` : ''}

            ${cleanDescription ? `
            <div class="description-container">
                <div class="description-title">Description</div>
                <div class="description-content" id="descriptionContent">
                    ${cleanDescription.replace(/\n/g, '<br>')}
                </div>
                ${cleanDescription.length > 150 ? `
                <button class="expand-btn" id="expandBtn">Show More</button>
                ` : ''}
            </div>
            ` : ''}

            <div class="info-panel">
                <div class="info-row">
                    <span class="info-label">Status:</span>
                    <span class="info-value" id="statusValue">Ready</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Quality:</span>
                    <span class="info-value" id="qualityValue">High</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Format:</span>
                    <span class="info-value" id="formatValue">MP3</span>
                </div>
            </div>
        `;

        document.body.innerHTML = '';
        document.body.appendChild(playerContainer);

        const enhancedAudio = document.createElement('audio');
        enhancedAudio.src = audioUrl;
        playerContainer.appendChild(enhancedAudio);

        initializePlayer(enhancedAudio);
    }

    function initializePlayer(audio) {
        // Get all controls
        const playPauseBtn = document.getElementById('playPauseBtn');
        const progressBar = document.getElementById('progressBar');
        const progressContainer = document.getElementById('progressContainer');
        const currentTimeSpan = document.getElementById('currentTime');
        const durationSpan = document.getElementById('duration');
        const volumeSlider = document.getElementById('volumeSlider');
        const volumeValue = document.getElementById('volumeValue');
        const volumeIcon = document.getElementById('volumeIcon');
        const statusValue = document.getElementById('statusValue');
        const downloadBtn = document.getElementById('downloadBtn');
        const waveformContainer = document.getElementById('waveformContainer');
        const waveformBars = document.querySelectorAll('.wave-bar');
        const expandBtn = document.getElementById('expandBtn');
        const descriptionContent = document.getElementById('descriptionContent');
        const shuffleBtn = document.getElementById('shuffleBtn');
        const repeatBtn = document.getElementById('repeatBtn');

        let isPlaying = false;
        let isDragging = false;
        let shuffleEnabled = false;
        let repeatEnabled = false;

        audio.volume = 0.5;

        // --- Player Logic ---
        function togglePlayPause() {
            if (isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }

        function updatePlayPauseUI(playing) {
            isPlaying = playing;
            playPauseBtn.innerHTML = isPlaying ? '⏸' : '▶';
            statusValue.textContent = isPlaying ? 'Playing' : 'Paused';
            if (isPlaying) {
                updateWaveformAnimation();
            } else {
                waveformBars.forEach(bar => bar.classList.remove('playing'));
            }
        }

        function updateWaveform(progress) {
            const activeIndex = Math.floor((progress / 100) * waveformBars.length);
            waveformBars.forEach((bar, index) => {
                bar.classList.toggle('active', index <= activeIndex);
            });
        }

        function updateWaveformAnimation() {
            const currentProgress = (audio.currentTime / audio.duration) * 100;
            const activeIndex = Math.floor((currentProgress / 100) * waveformBars.length);
            waveformBars.forEach((bar, index) => {
                 bar.classList.toggle('playing', isPlaying && index === activeIndex);
            });
        }

        function seek(e) {
            const rect = progressContainer.getBoundingClientRect();
            const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            if (isFinite(audio.duration)) {
                audio.currentTime = ratio * audio.duration;
            }
        }

        // --- Event Listeners ---
        playPauseBtn.addEventListener('click', togglePlayPause);
        audio.addEventListener('play', () => updatePlayPauseUI(true));
        audio.addEventListener('pause', () => updatePlayPauseUI(false));

        audio.addEventListener('timeupdate', () => {
            if (!isDragging && isFinite(audio.duration)) {
                const progress = (audio.currentTime / audio.duration) * 100;
                progressBar.style.width = progress + '%';
                currentTimeSpan.textContent = formatTime(audio.currentTime);
                updateWaveform(progress);
                updateWaveformAnimation();
            }
        });

        audio.addEventListener('loadedmetadata', () => {
            durationSpan.textContent = formatTime(audio.duration);
        });

        audio.addEventListener('ended', () => {
            if (repeatEnabled) {
                audio.currentTime = 0;
                audio.play();
            } else {
                updatePlayPauseUI(false);
                statusValue.textContent = 'Ended';
                progressBar.style.width = '0%';
                waveformBars.forEach(bar => bar.classList.remove('active', 'playing'));
            }
        });

        ['loadstart', 'waiting'].forEach(event => audio.addEventListener(event, () => {
             statusValue.textContent = event === 'loadstart' ? 'Loading...' : 'Buffering...';
        }));
        audio.addEventListener('canplay', () => statusValue.textContent = 'Ready');
        audio.addEventListener('error', () => statusValue.textContent = 'Error');

        progressContainer.addEventListener('mousedown', e => {
            isDragging = true;
            seek(e);
        });
        document.addEventListener('mousemove', e => {
            if (isDragging) seek(e);
        });
        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        waveformContainer.addEventListener('click', (e) => {
            if (isFinite(audio.duration)) {
                const rect = waveformContainer.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const width = rect.width;
                const clickRatio = (clickX - 15) / (width - 30);
                const clampedRatio = Math.max(0, Math.min(1, clickRatio));
                audio.currentTime = clampedRatio * audio.duration;
            }
        });

        volumeSlider.addEventListener('input', (e) => {
            const volume = e.target.value / 100;
            audio.volume = volume;
            volumeValue.textContent = e.target.value + '%';
            if (volume === 0) volumeIcon.textContent = '🔇';
            else if (volume < 0.5) volumeIcon.textContent = '🔉';
            else volumeIcon.textContent = '🔊';
        });

        volumeIcon.addEventListener('click', () => {
            if (audio.volume > 0) {
                audio.dataset.previousVolume = audio.volume;
                audio.volume = 0;
                volumeSlider.value = 0;
            } else {
                const previousVolume = parseFloat(audio.dataset.previousVolume) || 0.5;
                audio.volume = previousVolume;
                volumeSlider.value = previousVolume * 100;
            }
            volumeSlider.dispatchEvent(new Event('input'));
        });

        document.getElementById('prevBtn').addEventListener('click', () => {
             audio.currentTime = Math.max(0, audio.currentTime - 10);
        });

        document.getElementById('nextBtn').addEventListener('click', () => {
            audio.currentTime = Math.min(audio.duration, audio.currentTime + 10);
        });

        shuffleBtn.addEventListener('click', () => {
            shuffleEnabled = !shuffleEnabled;
            shuffleBtn.classList.toggle('btn-active', shuffleEnabled);
            statusValue.textContent = `Shuffle ${shuffleEnabled ? 'ON' : 'OFF'}`;
        });

        repeatBtn.addEventListener('click', () => {
            repeatEnabled = !repeatEnabled;
            repeatBtn.classList.toggle('btn-active', repeatEnabled);
            statusValue.textContent = `Repeat ${repeatEnabled ? 'ON' : 'OFF'}`;
        });

        // --- NEW: RELIABLE DOWNLOAD ---
        downloadBtn.addEventListener('click', () => {
            if (!audioUrl) return;

            const originalText = downloadBtn.innerHTML;
            statusValue.textContent = 'Preparing download...';
            downloadBtn.innerHTML = '⏬';

            try {
                const link = document.createElement('a');
                link.href = audioUrl;
                // Sanitize filename
                const fileName = (actualTitle.replace(/[\W_]+/g," ").trim() || 'audio') + '.mp3';
                link.download = fileName;

                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                statusValue.textContent = 'Download started!';
            } catch (error) {
                console.error('Download initiation failed:', error);
                statusValue.textContent = 'Download failed';
            } finally {
                setTimeout(() => {
                    downloadBtn.innerHTML = originalText;
                    if (statusValue.textContent === 'Download started!') {
                        statusValue.textContent = isPlaying ? 'Playing' : 'Ready';
                    }
                }, 2000);
            }
        });


        if (expandBtn && descriptionContent) {
            expandBtn.addEventListener('click', () => {
                const isExpanded = descriptionContent.classList.toggle('expanded');
                expandBtn.textContent = isExpanded ? 'Show Less' : 'Show More';
            });
        }

        // --- NEW: COPY TAGS TO CLIPBOARD ---
        const tagElements = document.querySelectorAll('.tag');
        tagElements.forEach(tag => {
            tag.addEventListener('click', () => {
                const originalText = tag.textContent;
                navigator.clipboard.writeText(originalText).then(() => {
                    const originalBg = tag.style.background;
                    tag.textContent = 'Copied!';
                    tag.style.background = 'linear-gradient(135deg, #28a745, #218838)';
                    setTimeout(() => {
                        tag.textContent = originalText;
                        tag.style.background = originalBg;
                    }, 1500);
                }).catch(err => {
                    console.error('Failed to copy tag: ', err);
                });
            });
        });

        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            switch(e.code) {
                case 'Space': e.preventDefault(); togglePlayPause(); break;
                case 'ArrowLeft': e.preventDefault(); audio.currentTime = Math.max(0, audio.currentTime - 5); break;
                case 'ArrowRight': e.preventDefault(); audio.currentTime = Math.min(audio.duration, audio.currentTime + 5); break;
                case 'ArrowUp': e.preventDefault(); volumeSlider.value = Math.min(100, parseInt(volumeSlider.value) + 5); volumeSlider.dispatchEvent(new Event('input')); break;
                case 'ArrowDown': e.preventDefault(); volumeSlider.value = Math.max(0, parseInt(volumeSlider.value) - 5); volumeSlider.dispatchEvent(new Event('input')); break;
                case 'KeyM': e.preventDefault(); volumeIcon.click(); break;
            }
        });

        // Initial animation for waveform
        setTimeout(() => {
             waveformBars.forEach((bar, i) => {
                 bar.style.animationDelay = i * 0.02 + 's';
             });
        }, 500);
    }

    function formatTime(seconds) {
        if (!isFinite(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();


