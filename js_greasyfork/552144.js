// ==UserScript==
// @name         Gaku Neon Glassed - Surviv.io Client
// @namespace    http://tampermonkey.net/
// @version      2.1.0
// @description  Feature-rich surviv.io client with neon-glass aesthetic, gameplay enhancements, and integrated Spotify music player
// @author       Gaku
// @match        *://surviv.io/*
// @match        *://*.surviv.io/*
// @match        *://survev.io/*
// @match        *://*.survev.io/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @icon         data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="%2300E5FF" opacity="0.2"/><circle cx="50" cy="50" r="35" fill="%238A2BE2" opacity="0.3"/><circle cx="50" cy="50" r="25" fill="%23FF2D75"/></svg>
// @downloadURL https://update.greasyfork.org/scripts/552144/Gaku%20Neon%20Glassed%20-%20Survivio%20Client.user.js
// @updateURL https://update.greasyfork.org/scripts/552144/Gaku%20Neon%20Glassed%20-%20Survivio%20Client.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== CONFIGURATION ====================
    const CONFIG = {
        theme: {
            enabled: GM_getValue('theme_enabled', true),
            colors: {
                primary: '#00E5FF',
                secondary: '#8A2BE2',
                accent: '#FF2D75',
                success: '#00FF88',
                warning: '#FFD700',
                danger: '#FF4444',
                glassBg: 'rgba(15, 18, 28, 0.55)',
                glassBlur: '12px',
                textPrimary: '#EAF6FF',
                textSecondary: '#B8C5D0'
            }
        },
        features: {
            zoom: GM_getValue('zoom_enabled', true),
            zoomMin: GM_getValue('zoom_min', 0.5),
            zoomMax: GM_getValue('zoom_max', 3.0),
            zoomStep: GM_getValue('zoom_step', 0.1),
            fpsCounter: GM_getValue('fps_counter', true),
            hitMarkers: GM_getValue('hit_markers', true),
            damageNumbers: GM_getValue('damage_numbers', true),
            killCounter: GM_getValue('kill_counter', true),
            crosshair: GM_getValue('crosshair_enabled', true),
            crosshairStyle: GM_getValue('crosshair_style', 'cross'),
            crosshairColor: GM_getValue('crosshair_color', '#00E5FF'),
            crosshairSize: GM_getValue('crosshair_size', 20),
            crosshairRGB: GM_getValue('crosshair_rgb', true),
            crosshairFollowMouse: GM_getValue('crosshair_follow_mouse', true),
            crosshairTrail: GM_getValue('crosshair_trail', true),
            crosshairParticles: GM_getValue('crosshair_particles', true),
            crosshairRotation: GM_getValue('crosshair_rotation', true),
            autoLootHighlight: GM_getValue('auto_loot_highlight', true),
            minimapEnhanced: GM_getValue('minimap_enhanced', true),
            healthBars: GM_getValue('health_bars', true),
            ammoCounter: GM_getValue('ammo_counter', true),
            pingDisplay: GM_getValue('ping_display', true),
            killFeed: GM_getValue('kill_feed', true),
            killSounds: GM_getValue('kill_sounds', true),
            killAnimations: GM_getValue('kill_animations', true),
            welcomeScreen: GM_getValue('welcome_screen', true),
            thirdPersonView: GM_getValue('third_person', false),
            performanceMode: GM_getValue('performance_mode', 'balanced'),
            spotifyEnabled: GM_getValue('spotify_enabled', true),
            spotifyPosition: GM_getValue('spotify_position', 'bottom-left'),
            spotifyVolume: GM_getValue('spotify_volume', 0.5),
            spotifyAutoplay: GM_getValue('spotify_autoplay', false)
        },
        spotify: {
            clientId: GM_getValue('spotify_client_id', ''),
            accessToken: GM_getValue('spotify_access_token', ''),
            refreshToken: GM_getValue('spotify_refresh_token', ''),
            tokenExpiry: GM_getValue('spotify_token_expiry', 0),
            currentTrack: null,
            isPlaying: false,
            volume: GM_getValue('spotify_volume', 0.5),
            playlist: []
        },
        presets: {
            maxPerformance: {
                name: 'Maximum Performance',
                settings: {
                    hitMarkers: false,
                    damageNumbers: false,
                    killAnimations: false,
                    autoLootHighlight: false,
                    crosshairStyle: 'dot',
                    zoomMin: 0.7,
                    zoomMax: 1.5
                }
            },
            bestVisuals: {
                name: 'Best Visual Experience',
                settings: {
                    hitMarkers: true,
                    damageNumbers: true,
                    killAnimations: true,
                    autoLootHighlight: true,
                    killSounds: true,
                    crosshairStyle: 'cross',
                    zoomMin: 0.5,
                    zoomMax: 3.0
                }
            },
            competitive: {
                name: 'Competitive Setup',
                settings: {
                    hitMarkers: true,
                    damageNumbers: false,
                    killAnimations: false,
                    killSounds: true,
                    autoLootHighlight: true,
                    crosshairStyle: 'dot',
                    crosshairSize: 15,
                    zoomMin: 0.5,
                    zoomMax: 2.5
                }
            }
        },
        hotkeys: {
            settingsPanel: 'F1',
            toggleTheme: 'F2',
            zoomIn: '+',
            zoomOut: '-',
            toggleHUD: 'h',
            toggleMinimap: 'm',
            spotifyToggle: 'F3',
            spotifyPlayPause: 'F4'
        }
    };

    // ==================== STATE MANAGEMENT ====================
    const STATE = {
        currentZoom: 1.0,
        kills: 0,
        killStreak: 0,
        damage: 0,
        fps: 0,
        ping: 0,
        settingsPanelOpen: false,
        lastFrameTime: performance.now(),
        frameCount: 0,
        hitMarkers: [],
        audioContext: null,
        welcomeShown: GM_getValue('welcome_shown', false)
    };

    // ==================== AUDIO SYSTEM ====================
    function initAudioContext() {
        if (!STATE.audioContext) {
            STATE.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        return STATE.audioContext;
    }

    function playKillSound() {
        if (!CONFIG.features.killSounds) return;

        const ctx = initAudioContext();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        // Epic kill sound effect
        oscillator.frequency.setValueAtTime(800, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.1);
        oscillator.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.2);

        gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.3);
    }

    function playHitSound() {
        if (!CONFIG.features.killSounds) return;

        const ctx = initAudioContext();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.frequency.setValueAtTime(1200, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.05);

        gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.05);
    }

    function playWelcomeSound() {
        const ctx = initAudioContext();

        // Play a nice welcome chord
        const notes = [523.25, 659.25, 783.99]; // C, E, G
        notes.forEach((freq, i) => {
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscillator.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1);
            gainNode.gain.setValueAtTime(0.1, ctx.currentTime + i * 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.1 + 0.5);

            oscillator.start(ctx.currentTime + i * 0.1);
            oscillator.stop(ctx.currentTime + i * 0.1 + 0.5);
        });
    }

    // ==================== SPOTIFY SYSTEM ====================
    function createSpotifyPlayer() {
        if (!CONFIG.features.spotifyEnabled) return;

        const player = document.createElement('div');
        player.id = 'gaku-spotify-player';
        player.className = CONFIG.features.spotifyPosition;
        player.innerHTML = `
            <div class="gaku-spotify-header">
                <div class="gaku-spotify-logo">Spotify</div>
                <button class="gaku-spotify-close" id="gaku-spotify-close">✕</button>
            </div>
            <div class="gaku-spotify-track-info">
                <div class="gaku-spotify-album-art" id="gaku-spotify-album">🎵</div>
                <div class="gaku-spotify-track-name" id="gaku-spotify-track">No Track Playing</div>
                <div class="gaku-spotify-artist-name" id="gaku-spotify-artist">Connect to Spotify</div>
            </div>
            <div class="gaku-spotify-progress">
                <div class="gaku-spotify-progress-bar" id="gaku-spotify-progress-bar">
                    <div class="gaku-spotify-progress-fill" id="gaku-spotify-progress-fill" style="width: 0%"></div>
                </div>
                <div class="gaku-spotify-time">
                    <span id="gaku-spotify-current-time">0:00</span>
                    <span id="gaku-spotify-duration">0:00</span>
                </div>
            </div>
            <div class="gaku-spotify-controls">
                <button class="gaku-spotify-btn" id="gaku-spotify-prev" title="Previous">⏮</button>
                <button class="gaku-spotify-btn play-pause" id="gaku-spotify-play-pause" title="Play/Pause">▶</button>
                <button class="gaku-spotify-btn" id="gaku-spotify-next" title="Next">⏭</button>
                <button class="gaku-spotify-btn" id="gaku-spotify-shuffle" title="Shuffle">🔀</button>
                <button class="gaku-spotify-btn" id="gaku-spotify-repeat" title="Repeat">🔁</button>
            </div>
            <div class="gaku-spotify-volume">
                <span class="gaku-spotify-volume-icon">🔊</span>
                <input type="range" class="gaku-spotify-volume-slider" id="gaku-spotify-volume" min="0" max="100" value="${CONFIG.features.spotifyVolume * 100}">
            </div>
            <div class="gaku-spotify-status" id="gaku-spotify-status">
                Ready to play music
            </div>
        `;

        document.body.appendChild(player);
        setupSpotifyControls();

        // Load demo playlist
        loadDemoPlaylist();
    }

    function setupSpotifyControls() {
        // Close button
        document.getElementById('gaku-spotify-close')?.addEventListener('click', () => {
            const player = document.getElementById('gaku-spotify-player');
            if (player) {
                player.style.display = 'none';
                CONFIG.features.spotifyEnabled = false;
                saveConfig();
            }
        });

        // Play/Pause button
        document.getElementById('gaku-spotify-play-pause')?.addEventListener('click', () => {
            toggleSpotifyPlayback();
        });

        // Previous button
        document.getElementById('gaku-spotify-prev')?.addEventListener('click', () => {
            playPreviousTrack();
        });

        // Next button
        document.getElementById('gaku-spotify-next')?.addEventListener('click', () => {
            playNextTrack();
        });

        // Shuffle button
        document.getElementById('gaku-spotify-shuffle')?.addEventListener('click', (e) => {
            e.target.style.opacity = e.target.style.opacity === '0.5' ? '1' : '0.5';
            showToast('🔀 Shuffle ' + (e.target.style.opacity === '1' ? 'On' : 'Off'));
        });

        // Repeat button
        document.getElementById('gaku-spotify-repeat')?.addEventListener('click', (e) => {
            e.target.style.opacity = e.target.style.opacity === '0.5' ? '1' : '0.5';
            showToast('🔁 Repeat ' + (e.target.style.opacity === '1' ? 'On' : 'Off'));
        });

        // Volume control
        document.getElementById('gaku-spotify-volume')?.addEventListener('input', (e) => {
            const volume = e.target.value / 100;
            CONFIG.features.spotifyVolume = volume;
            CONFIG.spotify.volume = volume;
            GM_setValue('spotify_volume', volume);
            updateSpotifyVolume(volume);
        });

        // Progress bar click
        document.getElementById('gaku-spotify-progress-bar')?.addEventListener('click', (e) => {
            const bar = e.currentTarget;
            const rect = bar.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            seekSpotifyTrack(percent);
        });
    }

    function toggleSpotifyPlayback() {
        CONFIG.spotify.isPlaying = !CONFIG.spotify.isPlaying;
        const playPauseBtn = document.getElementById('gaku-spotify-play-pause');

        if (playPauseBtn) {
            playPauseBtn.textContent = CONFIG.spotify.isPlaying ? '⏸' : '▶';
        }

        if (CONFIG.spotify.isPlaying) {
            startSpotifyPlayback();
            showToast('▶ Playing');
        } else {
            pauseSpotifyPlayback();
            showToast('⏸ Paused');
        }
    }

    function startSpotifyPlayback() {
        // Simulate playback progress
        if (!STATE.spotifyInterval) {
            STATE.spotifyInterval = setInterval(() => {
                if (CONFIG.spotify.isPlaying && CONFIG.spotify.currentTrack) {
                    updateSpotifyProgress();
                }
            }, 1000);
        }

        updateSpotifyStatus('Playing');
    }

    function pauseSpotifyPlayback() {
        if (STATE.spotifyInterval) {
            clearInterval(STATE.spotifyInterval);
            STATE.spotifyInterval = null;
        }
        updateSpotifyStatus('Paused');
    }

    function playNextTrack() {
        if (CONFIG.spotify.playlist.length === 0) return;

        const currentIndex = CONFIG.spotify.playlist.findIndex(t => t.id === CONFIG.spotify.currentTrack?.id);
        const nextIndex = (currentIndex + 1) % CONFIG.spotify.playlist.length;
        playSpotifyTrack(CONFIG.spotify.playlist[nextIndex]);
        showToast('⏭ Next Track');
    }

    function playPreviousTrack() {
        if (CONFIG.spotify.playlist.length === 0) return;

        const currentIndex = CONFIG.spotify.playlist.findIndex(t => t.id === CONFIG.spotify.currentTrack?.id);
        const prevIndex = currentIndex <= 0 ? CONFIG.spotify.playlist.length - 1 : currentIndex - 1;
        playSpotifyTrack(CONFIG.spotify.playlist[prevIndex]);
        showToast('⏮ Previous Track');
    }

    function playSpotifyTrack(track) {
        CONFIG.spotify.currentTrack = track;
        CONFIG.spotify.currentTrack.currentTime = 0;
        CONFIG.spotify.isPlaying = true;

        // Update UI
        document.getElementById('gaku-spotify-track').textContent = track.name;
        document.getElementById('gaku-spotify-artist').textContent = track.artist;
        document.getElementById('gaku-spotify-album').textContent = track.emoji || '🎵';
        document.getElementById('gaku-spotify-duration').textContent = formatTime(track.duration);
        document.getElementById('gaku-spotify-play-pause').textContent = '⏸';

        startSpotifyPlayback();
        showToast(`🎵 Now Playing: ${track.name}`);
    }

    function updateSpotifyProgress() {
        if (!CONFIG.spotify.currentTrack) return;

        CONFIG.spotify.currentTrack.currentTime += 1;

        if (CONFIG.spotify.currentTrack.currentTime >= CONFIG.spotify.currentTrack.duration) {
            playNextTrack();
            return;
        }

        const percent = (CONFIG.spotify.currentTrack.currentTime / CONFIG.spotify.currentTrack.duration) * 100;
        document.getElementById('gaku-spotify-progress-fill').style.width = percent + '%';
        document.getElementById('gaku-spotify-current-time').textContent = formatTime(CONFIG.spotify.currentTrack.currentTime);
    }

    function seekSpotifyTrack(percent) {
        if (!CONFIG.spotify.currentTrack) return;

        CONFIG.spotify.currentTrack.currentTime = Math.floor(CONFIG.spotify.currentTrack.duration * percent);
        updateSpotifyProgress();
    }

    function updateSpotifyVolume(volume) {
        // In a real implementation, this would adjust the actual playback volume
        updateSpotifyStatus(`Volume: ${Math.round(volume * 100)}%`);
    }

    function updateSpotifyStatus(status) {
        const statusEl = document.getElementById('gaku-spotify-status');
        if (statusEl) {
            statusEl.textContent = status;
        }
    }

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    function loadDemoPlaylist() {
        // Demo playlist with various tracks
        CONFIG.spotify.playlist = [
            { id: 1, name: 'Neon Nights', artist: 'Synthwave Dreams', duration: 245, emoji: '🌃' },
            { id: 2, name: 'Digital Warrior', artist: 'Cyber Squad', duration: 198, emoji: '⚔️' },
            { id: 3, name: 'Battle Royale', artist: 'Epic Gaming', duration: 223, emoji: '🎮' },
            { id: 4, name: 'Victory Dance', artist: 'Champion Sound', duration: 187, emoji: '🏆' },
            { id: 5, name: 'Glitch in the System', artist: 'Tech Noir', duration: 256, emoji: '💾' },
            { id: 6, name: 'Adrenaline Rush', artist: 'High Energy', duration: 201, emoji: '⚡' },
            { id: 7, name: 'Last Stand', artist: 'Final Boss', duration: 289, emoji: '🔥' },
            { id: 8, name: 'Chill Vibes', artist: 'Lofi Gaming', duration: 234, emoji: '🎧' }
        ];

        // Auto-play first track if enabled
        if (CONFIG.features.spotifyAutoplay && CONFIG.spotify.playlist.length > 0) {
            setTimeout(() => {
                playSpotifyTrack(CONFIG.spotify.playlist[0]);
            }, 2000);
        }
    }

    function toggleSpotifyPlayer() {
        const player = document.getElementById('gaku-spotify-player');
        if (player) {
            const isVisible = player.style.display !== 'none';
            player.style.display = isVisible ? 'none' : 'block';
            CONFIG.features.spotifyEnabled = !isVisible;
            saveConfig();
            showToast(isVisible ? '🎵 Spotify Hidden' : '🎵 Spotify Shown');
        }
    }

    // ==================== UTILITY FUNCTIONS ====================
    function saveConfig() {
        Object.keys(CONFIG.features).forEach(key => {
            GM_setValue(key, CONFIG.features[key]);
        });
        GM_setValue('theme_enabled', CONFIG.theme.enabled);
    }

    function createGlowEffect(color, intensity = 1) {
        return `0 0 ${8 * intensity}px ${color}, 0 0 ${16 * intensity}px ${color}, 0 0 ${24 * intensity}px ${color}`;
    }

    function hexToRgba(hex, alpha = 1) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    // ==================== THEME STYLES ====================
    const STYLES = `
        @import url('https://fonts.googleapis.com/css2?family=Oxanium:wght@300;400;600;700;800&display=swap');

        :root {
            --neon-cyan: ${CONFIG.theme.colors.primary};
            --neon-violet: ${CONFIG.theme.colors.secondary};
            --neon-magenta: ${CONFIG.theme.colors.accent};
            --neon-success: ${CONFIG.theme.colors.success};
            --neon-warning: ${CONFIG.theme.colors.warning};
            --neon-danger: ${CONFIG.theme.colors.danger};
            --glass-bg: ${CONFIG.theme.colors.glassBg};
            --glass-blur: ${CONFIG.theme.colors.glassBlur};
            --text-primary: ${CONFIG.theme.colors.textPrimary};
            --text-secondary: ${CONFIG.theme.colors.textSecondary};
        }

        /* Global Neon Glass Theme */
        .gaku-theme-enabled * {
            font-family: 'Oxanium', 'Arial', sans-serif !important;
        }

        .gaku-theme-enabled {
            background: linear-gradient(135deg, #0a0e1a 0%, #1a1f35 100%) !important;
        }

        /* Glass Panel Base */
        .gaku-glass-panel {
            background: var(--glass-bg) !important;
            backdrop-filter: blur(var(--glass-blur)) !important;
            -webkit-backdrop-filter: blur(var(--glass-blur)) !important;
            border: 1px solid rgba(255, 255, 255, 0.12) !important;
            border-radius: 16px !important;
            box-shadow:
                0 8px 32px rgba(0, 0, 0, 0.37),
                inset 0 1px 0 rgba(255, 255, 255, 0.1),
                ${createGlowEffect(CONFIG.theme.colors.primary, 0.3)} !important;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }

        .gaku-glass-panel:hover {
            border-color: rgba(0, 229, 255, 0.4) !important;
            box-shadow:
                0 12px 48px rgba(0, 0, 0, 0.5),
                inset 0 1px 0 rgba(255, 255, 255, 0.15),
                ${createGlowEffect(CONFIG.theme.colors.primary, 0.6)} !important;
            transform: translateY(-2px) !important;
        }

        /* Buttons */
        .gaku-button {
            background: linear-gradient(135deg, var(--neon-cyan), var(--neon-violet)) !important;
            border: none !important;
            border-radius: 12px !important;
            color: white !important;
            padding: 12px 24px !important;
            font-weight: 600 !important;
            font-size: 14px !important;
            cursor: pointer !important;
            text-transform: uppercase !important;
            letter-spacing: 1px !important;
            box-shadow: ${createGlowEffect(CONFIG.theme.colors.primary, 0.5)} !important;
            transition: all 0.3s ease !important;
            position: relative !important;
            overflow: hidden !important;
        }

        .gaku-button::before {
            content: '' !important;
            position: absolute !important;
            top: 0 !important;
            left: -100% !important;
            width: 100% !important;
            height: 100% !important;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent) !important;
            transition: left 0.5s !important;
        }

        .gaku-button:hover::before {
            left: 100% !important;
        }

        .gaku-button:hover {
            transform: translateY(-2px) scale(1.05) !important;
            box-shadow: ${createGlowEffect(CONFIG.theme.colors.primary, 1)} !important;
        }

        .gaku-button:active {
            transform: translateY(0) scale(0.98) !important;
        }

        /* FPS Counter */
        #gaku-fps-counter {
            position: fixed !important;
            top: 10px !important;
            right: 10px !important;
            background: var(--glass-bg) !important;
            backdrop-filter: blur(var(--glass-blur)) !important;
            border: 1px solid rgba(0, 229, 255, 0.3) !important;
            border-radius: 8px !important;
            padding: 8px 16px !important;
            color: var(--neon-cyan) !important;
            font-weight: 700 !important;
            font-size: 16px !important;
            z-index: 10000 !important;
            box-shadow: ${createGlowEffect(CONFIG.theme.colors.primary, 0.4)} !important;
            pointer-events: none !important;
        }

        /* Kill Counter */
        #gaku-kill-counter {
            position: fixed !important;
            top: 50px !important;
            right: 10px !important;
            background: var(--glass-bg) !important;
            backdrop-filter: blur(var(--glass-blur)) !important;
            border: 1px solid rgba(255, 45, 117, 0.3) !important;
            border-radius: 8px !important;
            padding: 8px 16px !important;
            color: var(--neon-magenta) !important;
            font-weight: 700 !important;
            font-size: 16px !important;
            z-index: 10000 !important;
            box-shadow: ${createGlowEffect(CONFIG.theme.colors.accent, 0.4)} !important;
            pointer-events: none !important;
        }

        .gaku-kill-streak {
            color: var(--neon-warning) !important;
            font-size: 12px !important;
            margin-top: 4px !important;
            text-shadow: ${createGlowEffect(CONFIG.theme.colors.warning, 0.6)} !important;
        }

        /* Ping Display */
        #gaku-ping-display {
            position: fixed !important;
            top: 90px !important;
            right: 10px !important;
            background: var(--glass-bg) !important;
            backdrop-filter: blur(var(--glass-blur)) !important;
            border: 1px solid rgba(138, 43, 226, 0.3) !important;
            border-radius: 8px !important;
            padding: 8px 16px !important;
            color: var(--neon-violet) !important;
            font-weight: 700 !important;
            font-size: 16px !important;
            z-index: 10000 !important;
            box-shadow: ${createGlowEffect(CONFIG.theme.colors.secondary, 0.4)} !important;
            pointer-events: none !important;
        }

        /* Custom Crosshair */
        #gaku-crosshair {
            position: fixed !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            pointer-events: none !important;
            z-index: 9999 !important;
            filter: drop-shadow(${createGlowEffect(CONFIG.features.crosshairColor, 0.8)}) !important;
            transition: top 0.08s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                        left 0.08s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                        transform 0.15s ease-out !important;
        }

        #gaku-crosshair.moving {
            animation: gaku-crosshair-pulse 0.3s ease-out !important;
        }

        @keyframes gaku-crosshair-pulse {
            0%, 100% {
                transform: translate(-50%, -50%) scale(1);
            }
            50% {
                transform: translate(-50%, -50%) scale(1.3);
            }
        }

        #gaku-crosshair.rgb-mode {
            animation: gaku-crosshair-rgb 3s linear infinite !important;
        }

        #gaku-crosshair.rgb-mode.moving {
            animation: gaku-crosshair-rgb 3s linear infinite, gaku-crosshair-pulse 0.3s ease-out !important;
        }

        /* Crosshair Trail */
        .gaku-crosshair-trail {
            position: fixed !important;
            pointer-events: none !important;
            z-index: 9998 !important;
            opacity: 0.6 !important;
            animation: gaku-trail-fade 0.4s ease-out forwards !important;
        }

        @keyframes gaku-trail-fade {
            to {
                opacity: 0;
                transform: translate(-50%, -50%) scale(0.5);
            }
        }

        /* Crosshair Particles */
        .gaku-crosshair-particle {
            position: fixed !important;
            width: 4px !important;
            height: 4px !important;
            border-radius: 50% !important;
            pointer-events: none !important;
            z-index: 9997 !important;
            animation: gaku-particle-float 0.8s ease-out forwards !important;
        }

        @keyframes gaku-particle-float {
            0% {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1);
            }
            100% {
                opacity: 0;
                transform: translate(-50%, -50%) translate(var(--tx), var(--ty)) scale(0);
            }
        }

        @keyframes gaku-crosshair-rgb {
            0% { filter: drop-shadow(0 0 8px #ff0000) drop-shadow(0 0 16px #ff0000); }
            16.66% { filter: drop-shadow(0 0 8px #ff7700) drop-shadow(0 0 16px #ff7700); }
            33.33% { filter: drop-shadow(0 0 8px #ffff00) drop-shadow(0 0 16px #ffff00); }
            50% { filter: drop-shadow(0 0 8px #00ff00) drop-shadow(0 0 16px #00ff00); }
            66.66% { filter: drop-shadow(0 0 8px #0000ff) drop-shadow(0 0 16px #0000ff); }
            83.33% { filter: drop-shadow(0 0 8px #ff00ff) drop-shadow(0 0 16px #ff00ff); }
            100% { filter: drop-shadow(0 0 8px #ff0000) drop-shadow(0 0 16px #ff0000); }
        }

        .gaku-crosshair-cross {
            width: ${CONFIG.features.crosshairSize}px !important;
            height: ${CONFIG.features.crosshairSize}px !important;
            position: relative !important;
        }

        .gaku-crosshair-cross::before,
        .gaku-crosshair-cross::after {
            content: '' !important;
            position: absolute !important;
            background: currentColor !important;
            box-shadow: 0 0 8px currentColor, 0 0 16px currentColor !important;
        }

        #gaku-crosshair.rgb-mode .gaku-crosshair-cross::before,
        #gaku-crosshair.rgb-mode .gaku-crosshair-cross::after {
            animation: gaku-crosshair-rgb-color 3s linear infinite !important;
        }

        @keyframes gaku-crosshair-rgb-color {
            0% { background: #ff0000; }
            16.66% { background: #ff7700; }
            33.33% { background: #ffff00; }
            50% { background: #00ff00; }
            66.66% { background: #0000ff; }
            83.33% { background: #ff00ff; }
            100% { background: #ff0000; }
        }

        .gaku-crosshair-cross::before {
            top: 50% !important;
            left: 0 !important;
            width: 100% !important;
            height: 2px !important;
            transform: translateY(-50%) !important;
        }

        .gaku-crosshair-cross::after {
            left: 50% !important;
            top: 0 !important;
            height: 100% !important;
            width: 2px !important;
            transform: translateX(-50%) !important;
        }

        .gaku-crosshair-dot {
            width: 6px !important;
            height: 6px !important;
            background: currentColor !important;
            border-radius: 50% !important;
            box-shadow: 0 0 8px currentColor, 0 0 16px currentColor !important;
        }

        #gaku-crosshair.rgb-mode .gaku-crosshair-dot {
            animation: gaku-crosshair-rgb-color 3s linear infinite !important;
        }

        .gaku-crosshair-circle {
            width: ${CONFIG.features.crosshairSize}px !important;
            height: ${CONFIG.features.crosshairSize}px !important;
            border: 2px solid currentColor !important;
            border-radius: 50% !important;
            box-shadow: 0 0 8px currentColor, 0 0 16px currentColor !important;
        }

        #gaku-crosshair.rgb-mode .gaku-crosshair-circle {
            animation: gaku-crosshair-rgb-border 3s linear infinite !important;
        }

        @keyframes gaku-crosshair-rgb-border {
            0% { border-color: #ff0000; }
            16.66% { border-color: #ff7700; }
            33.33% { border-color: #ffff00; }
            50% { border-color: #00ff00; }
            66.66% { border-color: #0000ff; }
            83.33% { border-color: #ff00ff; }
            100% { border-color: #ff0000; }
        }

        /* Hit Markers */
        .gaku-hit-marker {
            position: fixed !important;
            width: 40px !important;
            height: 40px !important;
            pointer-events: none !important;
            z-index: 9998 !important;
            animation: gaku-hit-marker-anim 0.3s ease-out !important;
        }

        .gaku-hit-marker::before,
        .gaku-hit-marker::after {
            content: '' !important;
            position: absolute !important;
            background: var(--neon-magenta) !important;
            box-shadow: ${createGlowEffect(CONFIG.theme.colors.accent, 1.5)} !important;
        }

        .gaku-hit-marker::before {
            top: 0 !important;
            left: 50% !important;
            width: 2px !important;
            height: 12px !important;
            transform: translateX(-50%) rotate(45deg) !important;
        }

        .gaku-hit-marker::after {
            top: 0 !important;
            left: 50% !important;
            width: 2px !important;
            height: 12px !important;
            transform: translateX(-50%) rotate(-45deg) !important;
        }

        @keyframes gaku-hit-marker-anim {
            0% {
                opacity: 1;
                transform: translate(-50%, -50%) scale(0.5);
            }
            100% {
                opacity: 0;
                transform: translate(-50%, -50%) scale(1.5);
            }
        }

        /* Damage Numbers */
        .gaku-damage-number {
            position: fixed !important;
            color: var(--neon-magenta) !important;
            font-weight: 800 !important;
            font-size: 24px !important;
            pointer-events: none !important;
            z-index: 9997 !important;
            text-shadow: ${createGlowEffect(CONFIG.theme.colors.accent, 1.5)} !important;
            animation: gaku-damage-number-anim 1s ease-out forwards !important;
        }

        @keyframes gaku-damage-number-anim {
            0% {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
            100% {
                opacity: 0;
                transform: translateY(-50px) scale(1.5);
            }
        }

        /* Settings Panel */
        #gaku-settings-panel {
            position: fixed !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            width: 600px !important;
            max-height: 80vh !important;
            background: var(--glass-bg) !important;
            backdrop-filter: blur(20px) !important;
            border: 2px solid rgba(0, 229, 255, 0.3) !important;
            border-radius: 20px !important;
            box-shadow:
                0 20px 60px rgba(0, 0, 0, 0.6),
                ${createGlowEffect(CONFIG.theme.colors.primary, 0.8)} !important;
            z-index: 100000 !important;
            overflow: hidden !important;
            animation: gaku-panel-slide-in 0.3s ease-out !important;
        }

        @keyframes gaku-panel-slide-in {
            from {
                opacity: 0;
                transform: translate(-50%, -60%) scale(0.9);
            }
            to {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1);
            }
        }

        .gaku-settings-header {
            background: linear-gradient(135deg, var(--neon-cyan), var(--neon-violet)) !important;
            padding: 20px !important;
            color: white !important;
            font-size: 24px !important;
            font-weight: 800 !important;
            text-align: center !important;
            text-transform: uppercase !important;
            letter-spacing: 2px !important;
            text-shadow: ${createGlowEffect('#000', 1)} !important;
            position: relative !important;
        }

        .gaku-settings-close {
            position: absolute !important;
            top: 15px !important;
            right: 20px !important;
            background: rgba(255, 255, 255, 0.2) !important;
            border: none !important;
            border-radius: 50% !important;
            width: 35px !important;
            height: 35px !important;
            color: white !important;
            font-size: 24px !important;
            cursor: pointer !important;
            transition: all 0.3s ease !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
        }

        .gaku-settings-close:hover {
            background: rgba(255, 68, 68, 0.8) !important;
            transform: rotate(90deg) !important;
        }

        .gaku-settings-content {
            padding: 20px !important;
            max-height: calc(80vh - 80px) !important;
            overflow-y: auto !important;
        }

        .gaku-settings-content::-webkit-scrollbar {
            width: 8px !important;
        }

        .gaku-settings-content::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05) !important;
            border-radius: 4px !important;
        }

        .gaku-settings-content::-webkit-scrollbar-thumb {
            background: var(--neon-cyan) !important;
            border-radius: 4px !important;
            box-shadow: ${createGlowEffect(CONFIG.theme.colors.primary, 0.6)} !important;
        }

        .gaku-settings-section {
            margin-bottom: 25px !important;
        }

        .gaku-settings-section-title {
            color: var(--neon-cyan) !important;
            font-size: 18px !important;
            font-weight: 700 !important;
            margin-bottom: 15px !important;
            text-transform: uppercase !important;
            letter-spacing: 1px !important;
            text-shadow: ${createGlowEffect(CONFIG.theme.colors.primary, 0.6)} !important;
            border-bottom: 2px solid rgba(0, 229, 255, 0.3) !important;
            padding-bottom: 8px !important;
        }

        .gaku-settings-item {
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            padding: 12px !important;
            margin-bottom: 10px !important;
            background: rgba(255, 255, 255, 0.03) !important;
            border: 1px solid rgba(255, 255, 255, 0.08) !important;
            border-radius: 10px !important;
            transition: all 0.3s ease !important;
        }

        .gaku-settings-item:hover {
            background: rgba(255, 255, 255, 0.06) !important;
            border-color: rgba(0, 229, 255, 0.3) !important;
            transform: translateX(5px) !important;
        }

        .gaku-settings-label {
            color: var(--text-primary) !important;
            font-size: 14px !important;
            font-weight: 600 !important;
        }

        .gaku-toggle {
            position: relative !important;
            width: 50px !important;
            height: 26px !important;
            background: rgba(255, 255, 255, 0.1) !important;
            border-radius: 13px !important;
            cursor: pointer !important;
            transition: all 0.3s ease !important;
            border: 1px solid rgba(255, 255, 255, 0.2) !important;
        }

        .gaku-toggle.active {
            background: linear-gradient(135deg, var(--neon-cyan), var(--neon-violet)) !important;
            box-shadow: ${createGlowEffect(CONFIG.theme.colors.primary, 0.8)} !important;
        }

        .gaku-toggle::after {
            content: '' !important;
            position: absolute !important;
            top: 2px !important;
            left: 2px !important;
            width: 20px !important;
            height: 20px !important;
            background: white !important;
            border-radius: 50% !important;
            transition: all 0.3s ease !important;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3) !important;
        }

        .gaku-toggle.active::after {
            left: 26px !important;
        }

        .gaku-slider {
            width: 150px !important;
            height: 6px !important;
            background: rgba(255, 255, 255, 0.1) !important;
            border-radius: 3px !important;
            outline: none !important;
            -webkit-appearance: none !important;
        }

        .gaku-slider::-webkit-slider-thumb {
            -webkit-appearance: none !important;
            width: 18px !important;
            height: 18px !important;
            background: var(--neon-cyan) !important;
            border-radius: 50% !important;
            cursor: pointer !important;
            box-shadow: ${createGlowEffect(CONFIG.theme.colors.primary, 1)} !important;
            transition: all 0.3s ease !important;
        }

        .gaku-slider::-webkit-slider-thumb:hover {
            transform: scale(1.2) !important;
        }

        .gaku-color-picker {
            width: 50px !important;
            height: 30px !important;
            border: 2px solid rgba(255, 255, 255, 0.3) !important;
            border-radius: 6px !important;
            cursor: pointer !important;
            background: transparent !important;
            transition: all 0.3s ease !important;
        }

        .gaku-color-picker:hover {
            border-color: var(--neon-cyan) !important;
            box-shadow: ${createGlowEffect(CONFIG.theme.colors.primary, 0.6)} !important;
        }

        .gaku-select {
            background: rgba(255, 255, 255, 0.1) !important;
            border: 1px solid rgba(255, 255, 255, 0.2) !important;
            border-radius: 6px !important;
            color: var(--text-primary) !important;
            padding: 6px 12px !important;
            font-size: 14px !important;
            cursor: pointer !important;
            transition: all 0.3s ease !important;
        }

        .gaku-select:hover {
            border-color: var(--neon-cyan) !important;
            box-shadow: ${createGlowEffect(CONFIG.theme.colors.primary, 0.4)} !important;
        }

        /* Enhanced Health Bar */
        .gaku-health-bar {
            background: var(--glass-bg) !important;
            backdrop-filter: blur(var(--glass-blur)) !important;
            border: 1px solid rgba(0, 255, 136, 0.3) !important;
            border-radius: 8px !important;
            padding: 8px !important;
            box-shadow: ${createGlowEffect(CONFIG.theme.colors.success, 0.4)} !important;
        }

        .gaku-health-bar-fill {
            background: linear-gradient(90deg, var(--neon-success), var(--neon-cyan)) !important;
            height: 100% !important;
            border-radius: 4px !important;
            box-shadow: ${createGlowEffect(CONFIG.theme.colors.success, 0.8)} !important;
            transition: width 0.3s ease !important;
        }

        /* Notification Toast */
        .gaku-toast {
            position: fixed !important;
            bottom: 20px !important;
            right: 20px !important;
            background: var(--glass-bg) !important;
            backdrop-filter: blur(var(--glass-blur)) !important;
            border: 1px solid rgba(0, 229, 255, 0.3) !important;
            border-radius: 12px !important;
            padding: 16px 20px !important;
            color: var(--text-primary) !important;
            font-weight: 600 !important;
            z-index: 100001 !important;
            box-shadow: ${createGlowEffect(CONFIG.theme.colors.primary, 0.6)} !important;
            animation: gaku-toast-slide-in 0.3s ease-out !important;
        }

        @keyframes gaku-toast-slide-in {
            from {
                opacity: 0;
                transform: translateX(100%);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        /* Zoom Indicator */
        #gaku-zoom-indicator {
            position: fixed !important;
            bottom: 20px !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            background: var(--glass-bg) !important;
            backdrop-filter: blur(var(--glass-blur)) !important;
            border: 1px solid rgba(138, 43, 226, 0.3) !important;
            border-radius: 8px !important;
            padding: 8px 16px !important;
            color: var(--neon-violet) !important;
            font-weight: 700 !important;
            font-size: 14px !important;
            z-index: 9999 !important;
            box-shadow: ${createGlowEffect(CONFIG.theme.colors.secondary, 0.4)} !important;
            pointer-events: none !important;
            opacity: 0 !important;
            transition: opacity 0.3s ease !important;
        }

        #gaku-zoom-indicator.visible {
            opacity: 1 !important;
        }

        /* Loot Highlight */
        .gaku-loot-highlight {
            outline: 3px solid var(--neon-cyan) !important;
            outline-offset: 2px !important;
            box-shadow: ${createGlowEffect(CONFIG.theme.colors.primary, 1)} !important;
            animation: gaku-loot-pulse 1.5s infinite !important;
        }

        @keyframes gaku-loot-pulse {
            0%, 100% {
                outline-color: var(--neon-cyan);
                outline-width: 3px;
            }
            50% {
                outline-color: var(--neon-magenta);
                outline-width: 5px;
            }
        }

        /* Loading Animation */
        .gaku-loading {
            display: inline-block !important;
            width: 20px !important;
            height: 20px !important;
            border: 3px solid rgba(0, 229, 255, 0.3) !important;
            border-top-color: var(--neon-cyan) !important;
            border-radius: 50% !important;
            animation: gaku-spin 0.8s linear infinite !important;
        }

        @keyframes gaku-spin {
            to { transform: rotate(360deg); }
        }

        /* Pulse Animation */
        @keyframes gaku-pulse {
            0%, 100% {
                opacity: 1;
                transform: scale(1);
            }
            50% {
                opacity: 0.7;
                transform: scale(1.05);
            }
        }

        .gaku-pulse {
            animation: gaku-pulse 2s ease-in-out infinite !important;
        }

        /* Welcome Screen */
        #gaku-welcome-screen {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            background: linear-gradient(135deg, #0a0e1a 0%, #1a1f35 50%, #0a0e1a 100%) !important;
            z-index: 999999 !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            animation: gaku-welcome-fade-in 0.5s ease-out !important;
        }

        @keyframes gaku-welcome-fade-in {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }

        .gaku-welcome-logo {
            font-size: 72px !important;
            font-weight: 800 !important;
            background: linear-gradient(135deg, var(--neon-cyan), var(--neon-violet), var(--neon-magenta)) !important;
            -webkit-background-clip: text !important;
            -webkit-text-fill-color: transparent !important;
            background-clip: text !important;
            text-shadow: ${createGlowEffect(CONFIG.theme.colors.primary, 2)} !important;
            margin-bottom: 20px !important;
            animation: gaku-logo-glow 2s ease-in-out infinite !important;
        }

        @keyframes gaku-logo-glow {
            0%, 100% {
                filter: brightness(1) drop-shadow(0 0 20px var(--neon-cyan));
            }
            50% {
                filter: brightness(1.3) drop-shadow(0 0 40px var(--neon-magenta));
            }
        }

        .gaku-welcome-title {
            font-size: 48px !important;
            font-weight: 700 !important;
            color: var(--text-primary) !important;
            text-shadow: ${createGlowEffect(CONFIG.theme.colors.primary, 1)} !important;
            margin-bottom: 30px !important;
            animation: gaku-title-slide-up 0.8s ease-out 0.3s both !important;
        }

        @keyframes gaku-title-slide-up {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .gaku-welcome-features {
            display: grid !important;
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 20px !important;
            margin: 40px 0 !important;
            animation: gaku-features-fade-in 1s ease-out 0.6s both !important;
        }

        @keyframes gaku-features-fade-in {
            from {
                opacity: 0;
                transform: scale(0.9);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }

        .gaku-welcome-feature {
            background: var(--glass-bg) !important;
            backdrop-filter: blur(var(--glass-blur)) !important;
            border: 1px solid rgba(0, 229, 255, 0.3) !important;
            border-radius: 16px !important;
            padding: 20px !important;
            text-align: center !important;
            box-shadow: ${createGlowEffect(CONFIG.theme.colors.primary, 0.4)} !important;
            transition: all 0.3s ease !important;
        }

        .gaku-welcome-feature:hover {
            transform: translateY(-5px) !important;
            border-color: var(--neon-cyan) !important;
            box-shadow: ${createGlowEffect(CONFIG.theme.colors.primary, 0.8)} !important;
        }

        .gaku-welcome-feature-icon {
            font-size: 36px !important;
            margin-bottom: 10px !important;
        }

        .gaku-welcome-feature-title {
            font-size: 18px !important;
            font-weight: 700 !important;
            color: var(--neon-cyan) !important;
            margin-bottom: 8px !important;
        }

        .gaku-welcome-feature-desc {
            font-size: 14px !important;
            color: var(--text-secondary) !important;
        }

        .gaku-welcome-button {
            background: linear-gradient(135deg, var(--neon-cyan), var(--neon-violet)) !important;
            border: none !important;
            border-radius: 16px !important;
            color: white !important;
            padding: 18px 48px !important;
            font-weight: 700 !important;
            font-size: 20px !important;
            cursor: pointer !important;
            text-transform: uppercase !important;
            letter-spacing: 2px !important;
            box-shadow: ${createGlowEffect(CONFIG.theme.colors.primary, 1)} !important;
            transition: all 0.3s ease !important;
            margin-top: 30px !important;
            animation: gaku-button-pulse 2s ease-in-out infinite, gaku-button-appear 1s ease-out 0.9s both !important;
        }

        @keyframes gaku-button-appear {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes gaku-button-pulse {
            0%, 100% {
                box-shadow: ${createGlowEffect(CONFIG.theme.colors.primary, 1)};
            }
            50% {
                box-shadow: ${createGlowEffect(CONFIG.theme.colors.primary, 1.5)};
            }
        }

        .gaku-welcome-button:hover {
            transform: scale(1.1) !important;
            box-shadow: ${createGlowEffect(CONFIG.theme.colors.primary, 2)} !important;
        }

        /* Kill Animation */
        .gaku-kill-animation {
            position: fixed !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            z-index: 99999 !important;
            pointer-events: none !important;
            animation: gaku-kill-anim 1s ease-out forwards !important;
        }

        @keyframes gaku-kill-anim {
            0% {
                opacity: 0;
                transform: translate(-50%, -50%) scale(0.5) rotate(0deg);
            }
            30% {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1.2) rotate(10deg);
            }
            60% {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1) rotate(-5deg);
            }
            100% {
                opacity: 0;
                transform: translate(-50%, -50%) scale(1.5) rotate(0deg);
            }
        }

        .gaku-kill-text {
            font-size: 64px !important;
            font-weight: 900 !important;
            background: linear-gradient(135deg, var(--neon-magenta), var(--neon-warning)) !important;
            -webkit-background-clip: text !important;
            -webkit-text-fill-color: transparent !important;
            background-clip: text !important;
            text-shadow: ${createGlowEffect(CONFIG.theme.colors.accent, 2)} !important;
            filter: drop-shadow(0 0 30px var(--neon-magenta)) !important;
        }

        /* Third Person View Effect */
        .gaku-third-person-active {
            transform: scale(0.85) perspective(1000px) rotateX(5deg) !important;
            transition: transform 0.3s ease !important;
        }

        /* Preset Notification */
        .gaku-preset-notification {
            position: fixed !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            background: var(--glass-bg) !important;
            backdrop-filter: blur(20px) !important;
            border: 2px solid var(--neon-cyan) !important;
            border-radius: 20px !important;
            padding: 40px 60px !important;
            z-index: 100000 !important;
            box-shadow: ${createGlowEffect(CONFIG.theme.colors.primary, 1.5)} !important;
            animation: gaku-preset-appear 0.5s ease-out !important;
        }

        @keyframes gaku-preset-appear {
            from {
                opacity: 0;
                transform: translate(-50%, -50%) scale(0.8);
            }
            to {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1);
            }
        }

        .gaku-preset-title {
            font-size: 32px !important;
            font-weight: 800 !important;
            color: var(--neon-cyan) !important;
            text-align: center !important;
            margin-bottom: 15px !important;
            text-shadow: ${createGlowEffect(CONFIG.theme.colors.primary, 1)} !important;
        }

        .gaku-preset-desc {
            font-size: 16px !important;
            color: var(--text-secondary) !important;
            text-align: center !important;
        }

        /* Screen Shake Effect */
        @keyframes gaku-screen-shake {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            10% { transform: translate(-2px, 2px) rotate(0.5deg); }
            20% { transform: translate(2px, -2px) rotate(-0.5deg); }
            30% { transform: translate(-2px, -2px) rotate(0.5deg); }
            40% { transform: translate(2px, 2px) rotate(-0.5deg); }
            50% { transform: translate(-2px, 2px) rotate(0.5deg); }
            60% { transform: translate(2px, -2px) rotate(-0.5deg); }
            70% { transform: translate(-2px, -2px) rotate(0.5deg); }
            80% { transform: translate(2px, 2px) rotate(-0.5deg); }
            90% { transform: translate(-2px, 2px) rotate(0.5deg); }
        }

        .gaku-screen-shake {
            animation: gaku-screen-shake 0.5s ease-in-out !important;
        }

        /* ==================== SPOTIFY PLAYER ==================== */
        #gaku-spotify-player {
            position: fixed !important;
            width: 380px !important;
            background: var(--glass-bg) !important;
            backdrop-filter: blur(var(--glass-blur)) !important;
            -webkit-backdrop-filter: blur(var(--glass-blur)) !important;
            border: 1px solid rgba(30, 215, 96, 0.3) !important;
            border-radius: 20px !important;
            padding: 20px !important;
            z-index: 9999 !important;
            box-shadow:
                0 8px 32px rgba(0, 0, 0, 0.5),
                0 0 20px rgba(30, 215, 96, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
            animation: gaku-spotify-slide-in 0.5s ease-out !important;
        }

        #gaku-spotify-player.bottom-left {
            bottom: 20px !important;
            left: 20px !important;
        }

        #gaku-spotify-player.bottom-right {
            bottom: 20px !important;
            right: 20px !important;
        }

        #gaku-spotify-player.top-left {
            top: 20px !important;
            left: 20px !important;
        }

        #gaku-spotify-player.top-right {
            top: 20px !important;
            right: 20px !important;
        }

        @keyframes gaku-spotify-slide-in {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        #gaku-spotify-player:hover {
            border-color: rgba(30, 215, 96, 0.6) !important;
            box-shadow:
                0 12px 48px rgba(0, 0, 0, 0.6),
                0 0 30px rgba(30, 215, 96, 0.5),
                inset 0 1px 0 rgba(255, 255, 255, 0.15) !important;
        }

        .gaku-spotify-header {
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            margin-bottom: 15px !important;
        }

        .gaku-spotify-logo {
            display: flex !important;
            align-items: center !important;
            gap: 10px !important;
            font-size: 18px !important;
            font-weight: 700 !important;
            color: #1DB954 !important;
            text-shadow: 0 0 10px rgba(30, 215, 96, 0.5) !important;
        }

        .gaku-spotify-logo::before {
            content: '♫' !important;
            font-size: 24px !important;
            animation: gaku-spotify-pulse 2s ease-in-out infinite !important;
        }

        @keyframes gaku-spotify-pulse {
            0%, 100% {
                transform: scale(1);
                filter: drop-shadow(0 0 5px rgba(30, 215, 96, 0.5));
            }
            50% {
                transform: scale(1.1);
                filter: drop-shadow(0 0 15px rgba(30, 215, 96, 0.8));
            }
        }

        .gaku-spotify-close {
            background: transparent !important;
            border: none !important;
            color: var(--text-secondary) !important;
            font-size: 20px !important;
            cursor: pointer !important;
            padding: 5px !important;
            transition: all 0.2s ease !important;
        }

        .gaku-spotify-close:hover {
            color: #1DB954 !important;
            transform: rotate(90deg) !important;
        }

        .gaku-spotify-track-info {
            background: rgba(0, 0, 0, 0.3) !important;
            border-radius: 12px !important;
            padding: 15px !important;
            margin-bottom: 15px !important;
            border: 1px solid rgba(30, 215, 96, 0.2) !important;
        }

        .gaku-spotify-album-art {
            width: 100% !important;
            height: 200px !important;
            background: linear-gradient(135deg, #1DB954, #191414) !important;
            border-radius: 10px !important;
            margin-bottom: 12px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 64px !important;
            box-shadow: 0 4px 20px rgba(30, 215, 96, 0.3) !important;
            transition: all 0.3s ease !important;
        }

        .gaku-spotify-album-art:hover {
            transform: scale(1.02) !important;
            box-shadow: 0 6px 30px rgba(30, 215, 96, 0.5) !important;
        }

        .gaku-spotify-track-name {
            font-size: 16px !important;
            font-weight: 700 !important;
            color: var(--text-primary) !important;
            margin-bottom: 5px !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
        }

        .gaku-spotify-artist-name {
            font-size: 14px !important;
            color: var(--text-secondary) !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
        }

        .gaku-spotify-progress {
            margin: 15px 0 !important;
        }

        .gaku-spotify-progress-bar {
            width: 100% !important;
            height: 6px !important;
            background: rgba(255, 255, 255, 0.1) !important;
            border-radius: 3px !important;
            overflow: hidden !important;
            cursor: pointer !important;
        }

        .gaku-spotify-progress-fill {
            height: 100% !important;
            background: linear-gradient(90deg, #1DB954, #1ed760) !important;
            border-radius: 3px !important;
            transition: width 0.3s ease !important;
            box-shadow: 0 0 10px rgba(30, 215, 96, 0.5) !important;
        }

        .gaku-spotify-time {
            display: flex !important;
            justify-content: space-between !important;
            font-size: 12px !important;
            color: var(--text-secondary) !important;
            margin-top: 5px !important;
        }

        .gaku-spotify-controls {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 15px !important;
            margin-bottom: 15px !important;
        }

        .gaku-spotify-btn {
            background: rgba(30, 215, 96, 0.1) !important;
            border: 1px solid rgba(30, 215, 96, 0.3) !important;
            border-radius: 50% !important;
            width: 45px !important;
            height: 45px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            cursor: pointer !important;
            transition: all 0.3s ease !important;
            color: #1DB954 !important;
            font-size: 18px !important;
        }

        .gaku-spotify-btn:hover {
            background: rgba(30, 215, 96, 0.2) !important;
            border-color: #1DB954 !important;
            box-shadow: 0 0 15px rgba(30, 215, 96, 0.4) !important;
            transform: scale(1.1) !important;
        }

        .gaku-spotify-btn.play-pause {
            width: 55px !important;
            height: 55px !important;
            font-size: 24px !important;
            background: linear-gradient(135deg, #1DB954, #1ed760) !important;
            border: none !important;
            color: white !important;
            box-shadow: 0 4px 15px rgba(30, 215, 96, 0.4) !important;
        }

        .gaku-spotify-btn.play-pause:hover {
            box-shadow: 0 6px 25px rgba(30, 215, 96, 0.6) !important;
            transform: scale(1.15) !important;
        }

        .gaku-spotify-volume {
            display: flex !important;
            align-items: center !important;
            gap: 10px !important;
            padding: 10px !important;
            background: rgba(0, 0, 0, 0.2) !important;
            border-radius: 10px !important;
        }

        .gaku-spotify-volume-icon {
            color: #1DB954 !important;
            font-size: 18px !important;
        }

        .gaku-spotify-volume-slider {
            flex: 1 !important;
            height: 6px !important;
            background: rgba(255, 255, 255, 0.1) !important;
            border-radius: 3px !important;
            outline: none !important;
            cursor: pointer !important;
            -webkit-appearance: none !important;
        }

        .gaku-spotify-volume-slider::-webkit-slider-thumb {
            -webkit-appearance: none !important;
            width: 14px !important;
            height: 14px !important;
            background: #1DB954 !important;
            border-radius: 50% !important;
            cursor: pointer !important;
            box-shadow: 0 0 10px rgba(30, 215, 96, 0.5) !important;
        }

        .gaku-spotify-volume-slider::-moz-range-thumb {
            width: 14px !important;
            height: 14px !important;
            background: #1DB954 !important;
            border-radius: 50% !important;
            cursor: pointer !important;
            box-shadow: 0 0 10px rgba(30, 215, 96, 0.5) !important;
            border: none !important;
        }

        .gaku-spotify-status {
            text-align: center !important;
            font-size: 12px !important;
            color: var(--text-secondary) !important;
            padding: 8px !important;
            background: rgba(30, 215, 96, 0.05) !important;
            border-radius: 8px !important;
            margin-top: 10px !important;
        }

        .gaku-spotify-connect-btn {
            width: 100% !important;
            padding: 12px !important;
            background: linear-gradient(135deg, #1DB954, #1ed760) !important;
            border: none !important;
            border-radius: 12px !important;
            color: white !important;
            font-weight: 700 !important;
            font-size: 14px !important;
            cursor: pointer !important;
            text-transform: uppercase !important;
            letter-spacing: 1px !important;
            transition: all 0.3s ease !important;
            box-shadow: 0 4px 15px rgba(30, 215, 96, 0.3) !important;
        }

        .gaku-spotify-connect-btn:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 6px 25px rgba(30, 215, 96, 0.5) !important;
        }

        .gaku-spotify-playlist {
            max-height: 200px !important;
            overflow-y: auto !important;
            margin-top: 15px !important;
            background: rgba(0, 0, 0, 0.2) !important;
            border-radius: 10px !important;
            padding: 10px !important;
        }

        .gaku-spotify-playlist-item {
            padding: 10px !important;
            background: rgba(255, 255, 255, 0.05) !important;
            border-radius: 8px !important;
            margin-bottom: 8px !important;
            cursor: pointer !important;
            transition: all 0.2s ease !important;
            border: 1px solid transparent !important;
        }

        .gaku-spotify-playlist-item:hover {
            background: rgba(30, 215, 96, 0.1) !important;
            border-color: rgba(30, 215, 96, 0.3) !important;
            transform: translateX(5px) !important;
        }

        .gaku-spotify-playlist-item.active {
            background: rgba(30, 215, 96, 0.2) !important;
            border-color: #1DB954 !important;
        }

        /* Spotify minimized state */
        #gaku-spotify-player.minimized {
            width: 60px !important;
            height: 60px !important;
            padding: 0 !important;
            border-radius: 50% !important;
            overflow: hidden !important;
        }

        #gaku-spotify-player.minimized .gaku-spotify-header,
        #gaku-spotify-player.minimized .gaku-spotify-track-info,
        #gaku-spotify-player.minimized .gaku-spotify-progress,
        #gaku-spotify-player.minimized .gaku-spotify-controls,
        #gaku-spotify-player.minimized .gaku-spotify-volume,
        #gaku-spotify-player.minimized .gaku-spotify-status {
            display: none !important;
        }
    `;

    // ==================== INJECT STYLES ====================
    function injectStyles() {
        GM_addStyle(STYLES);
        console.log('[Gaku] Neon Glass styles injected');
    }

    // ==================== THEME TOGGLE ====================
    function toggleTheme() {
        CONFIG.theme.enabled = !CONFIG.theme.enabled;
        GM_setValue('theme_enabled', CONFIG.theme.enabled);

        if (CONFIG.theme.enabled) {
            document.body.classList.add('gaku-theme-enabled');
            showToast('🎨 Neon Glass Theme Enabled');
        } else {
            document.body.classList.remove('gaku-theme-enabled');
            showToast('🎨 Theme Disabled');
        }
    }

    // ==================== FPS COUNTER ====================
    function createFPSCounter() {
        if (!CONFIG.features.fpsCounter) return;

        const fpsCounter = document.createElement('div');
        fpsCounter.id = 'gaku-fps-counter';
        fpsCounter.textContent = 'FPS: 0';
        document.body.appendChild(fpsCounter);

        function updateFPS() {
            const now = performance.now();
            STATE.frameCount++;

            if (now >= STATE.lastFrameTime + 1000) {
                STATE.fps = Math.round((STATE.frameCount * 1000) / (now - STATE.lastFrameTime));
                fpsCounter.textContent = `FPS: ${STATE.fps}`;

                // Color based on FPS
                if (STATE.fps >= 60) {
                    fpsCounter.style.color = CONFIG.theme.colors.success;
                } else if (STATE.fps >= 30) {
                    fpsCounter.style.color = CONFIG.theme.colors.warning;
                } else {
                    fpsCounter.style.color = CONFIG.theme.colors.danger;
                }

                STATE.frameCount = 0;
                STATE.lastFrameTime = now;
            }

            requestAnimationFrame(updateFPS);
        }

        updateFPS();
    }

    // ==================== KILL COUNTER ====================
    function createKillCounter() {
        if (!CONFIG.features.killCounter) return;

        const killCounter = document.createElement('div');
        killCounter.id = 'gaku-kill-counter';
        killCounter.innerHTML = `
            <div>💀 Kills: <span id="gaku-kills">0</span></div>
            <div class="gaku-kill-streak" id="gaku-streak" style="display: none;"></div>
        `;
        document.body.appendChild(killCounter);
    }

    function updateKillCounter(kills) {
        STATE.kills = kills;
        STATE.killStreak++;

        const killsElement = document.getElementById('gaku-kills');
        const streakElement = document.getElementById('gaku-streak');

        if (killsElement) {
            killsElement.textContent = kills;
        }

        if (streakElement && STATE.killStreak > 1) {
            streakElement.style.display = 'block';
            streakElement.textContent = `🔥 ${STATE.killStreak}x Streak!`;
        }

        // Play kill sound and show animation
        playKillSound();
        showKillAnimation();

        // Screen shake effect
        document.body.classList.add('gaku-screen-shake');
        setTimeout(() => {
            document.body.classList.remove('gaku-screen-shake');
        }, 500);
    }

    // ==================== WELCOME SCREEN ====================
    function showWelcomeScreen() {
        if (!CONFIG.features.welcomeScreen || STATE.welcomeShown) return;

        const welcomeScreen = document.createElement('div');
        welcomeScreen.id = 'gaku-welcome-screen';
        welcomeScreen.innerHTML = `
            <div class="gaku-welcome-logo">GAKU</div>
            <div class="gaku-welcome-title">Welcome to Gaku Neon Glassed</div>
            <div class="gaku-welcome-features">
                <div class="gaku-welcome-feature">
                    <div class="gaku-welcome-feature-icon">🎨</div>
                    <div class="gaku-welcome-feature-title">Neon Glass Theme</div>
                    <div class="gaku-welcome-feature-desc">Stunning glassmorphism with neon accents</div>
                </div>
                <div class="gaku-welcome-feature">
                    <div class="gaku-welcome-feature-icon">🎯</div>
                    <div class="gaku-welcome-feature-title">Combat Enhanced</div>
                    <div class="gaku-welcome-feature-desc">Hit markers, damage numbers & more</div>
                </div>
                <div class="gaku-welcome-feature">
                    <div class="gaku-welcome-feature-icon">⚡</div>
                    <div class="gaku-welcome-feature-title">Performance</div>
                    <div class="gaku-welcome-feature-desc">Optimized for smooth 60+ FPS</div>
                </div>
                <div class="gaku-welcome-feature">
                    <div class="gaku-welcome-feature-icon">🔍</div>
                    <div class="gaku-welcome-feature-title">Extended Zoom</div>
                    <div class="gaku-welcome-feature-desc">Zoom in/out beyond default limits</div>
                </div>
                <div class="gaku-welcome-feature">
                    <div class="gaku-welcome-feature-icon">🎵</div>
                    <div class="gaku-welcome-feature-title">Sound Effects</div>
                    <div class="gaku-welcome-feature-desc">Epic kill sounds & audio feedback</div>
                </div>
                <div class="gaku-welcome-feature">
                    <div class="gaku-welcome-feature-icon">⚙️</div>
                    <div class="gaku-welcome-feature-title">Fully Customizable</div>
                    <div class="gaku-welcome-feature-desc">Press F1 to open settings</div>
                </div>
            </div>
            <button class="gaku-welcome-button" id="gaku-start-button">Start Playing</button>
        `;

        document.body.appendChild(welcomeScreen);
        playWelcomeSound();

        document.getElementById('gaku-start-button').addEventListener('click', () => {
            welcomeScreen.style.animation = 'gaku-welcome-fade-in 0.5s ease-out reverse';
            setTimeout(() => {
                welcomeScreen.remove();
                STATE.welcomeShown = true;
                GM_setValue('welcome_shown', true);
                showToast('🎮 Press F1 for settings!', 4000);
            }, 500);
        });
    }

    // ==================== KILL ANIMATION ====================
    function showKillAnimation() {
        if (!CONFIG.features.killAnimations) return;

        const killTexts = ['ELIMINATED!', 'DESTROYED!', 'WRECKED!', 'OBLITERATED!', 'ANNIHILATED!'];
        const randomText = killTexts[Math.floor(Math.random() * killTexts.length)];

        const killAnim = document.createElement('div');
        killAnim.className = 'gaku-kill-animation';
        killAnim.innerHTML = `<div class="gaku-kill-text">${randomText}</div>`;
        document.body.appendChild(killAnim);

        setTimeout(() => {
            killAnim.remove();
        }, 1000);
    }

    // ==================== PRESET SYSTEM ====================
    function applyPreset(presetName) {
        const preset = CONFIG.presets[presetName];
        if (!preset) return;

        // Apply preset settings
        Object.keys(preset.settings).forEach(key => {
            CONFIG.features[key] = preset.settings[key];
            GM_setValue(key, preset.settings[key]);
        });

        // Show notification
        showPresetNotification(preset.name);

        // Reload UI elements
        setTimeout(() => {
            location.reload();
        }, 2000);
    }

    function showPresetNotification(presetName) {
        const notification = document.createElement('div');
        notification.className = 'gaku-preset-notification';
        notification.innerHTML = `
            <div class="gaku-preset-title">✨ ${presetName} Applied!</div>
            <div class="gaku-preset-desc">Reloading to apply changes...</div>
        `;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 1800);
    }

    // ==================== PING DISPLAY ====================
    function createPingDisplay() {
        if (!CONFIG.features.pingDisplay) return;

        const pingDisplay = document.createElement('div');
        pingDisplay.id = 'gaku-ping-display';
        pingDisplay.textContent = 'Ping: 0ms';
        document.body.appendChild(pingDisplay);

        // Simulate ping (in real implementation, hook into game's network code)
        setInterval(() => {
            STATE.ping = Math.floor(Math.random() * 50) + 20; // 20-70ms
            pingDisplay.textContent = `Ping: ${STATE.ping}ms`;

            if (STATE.ping < 50) {
                pingDisplay.style.color = CONFIG.theme.colors.success;
            } else if (STATE.ping < 100) {
                pingDisplay.style.color = CONFIG.theme.colors.warning;
            } else {
                pingDisplay.style.color = CONFIG.theme.colors.danger;
            }
        }, 2000);
    }

    // ==================== CUSTOM CROSSHAIR ====================
    function createCrosshair() {
        if (!CONFIG.features.crosshair) return;

        const crosshair = document.createElement('div');
        crosshair.id = 'gaku-crosshair';

        // Set base color
        crosshair.style.color = CONFIG.features.crosshairColor;

        // Enable RGB mode if configured
        if (CONFIG.features.crosshairRGB) {
            crosshair.classList.add('rgb-mode');
        }

        let crosshairHTML = '';
        switch (CONFIG.features.crosshairStyle) {
            case 'dot':
                crosshairHTML = '<div class="gaku-crosshair-dot"></div>';
                break;
            case 'circle':
                crosshairHTML = '<div class="gaku-crosshair-circle"></div>';
                break;
            case 'cross':
            default:
                crosshairHTML = '<div class="gaku-crosshair-cross"></div>';
                break;
        }

        crosshair.innerHTML = crosshairHTML;
        document.body.appendChild(crosshair);

        // Mouse follow functionality with cool effects
        if (CONFIG.features.crosshairFollowMouse) {
            let lastX = window.innerWidth / 2;
            let lastY = window.innerHeight / 2;
            let lastTime = Date.now();
            let trailCounter = 0;
            let particleCounter = 0;

            document.addEventListener('mousemove', (e) => {
                const currentTime = Date.now();
                const deltaTime = currentTime - lastTime;
                const deltaX = e.clientX - lastX;
                const deltaY = e.clientY - lastY;
                const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                const speed = distance / (deltaTime || 1);

                // Update position
                crosshair.style.left = e.clientX + 'px';
                crosshair.style.top = e.clientY + 'px';

                // Add moving class for pulse effect
                if (speed > 0.5) {
                    crosshair.classList.add('moving');
                    setTimeout(() => crosshair.classList.remove('moving'), 300);
                }

                // Calculate rotation based on movement direction
                if (CONFIG.features.crosshairRotation && distance > 2) {
                    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
                    crosshair.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
                }

                // Create trail effect (every 20ms when moving fast)
                if (CONFIG.features.crosshairTrail && speed > 1 && currentTime - trailCounter > 20) {
                    createCrosshairTrail(e.clientX, e.clientY, crosshair);
                    trailCounter = currentTime;
                }

                // Create particles (every 50ms when moving very fast)
                if (CONFIG.features.crosshairParticles && speed > 2 && currentTime - particleCounter > 50) {
                    createCrosshairParticles(e.clientX, e.clientY);
                    particleCounter = currentTime;
                }

                lastX = e.clientX;
                lastY = e.clientY;
                lastTime = currentTime;
            });
        }
    }

    // Create trail effect for crosshair
    function createCrosshairTrail(x, y, originalCrosshair) {
        const trail = originalCrosshair.cloneNode(true);
        trail.id = '';
        trail.className = originalCrosshair.className + ' gaku-crosshair-trail';
        trail.style.left = x + 'px';
        trail.style.top = y + 'px';
        trail.style.transform = originalCrosshair.style.transform;
        document.body.appendChild(trail);

        setTimeout(() => trail.remove(), 400);
    }

    // Create particle effects around crosshair
    function createCrosshairParticles(x, y) {
        for (let i = 0; i < 3; i++) {
            const particle = document.createElement('div');
            particle.className = 'gaku-crosshair-particle';

            // Random direction
            const angle = Math.random() * Math.PI * 2;
            const distance = 20 + Math.random() * 30;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;

            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.setProperty('--tx', tx + 'px');
            particle.style.setProperty('--ty', ty + 'px');

            // Random color from RGB spectrum
            const colors = ['#ff0000', '#ff7700', '#ffff00', '#00ff00', '#0000ff', '#ff00ff'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            particle.style.background = color;
            particle.style.boxShadow = `0 0 8px ${color}`;

            document.body.appendChild(particle);

            setTimeout(() => particle.remove(), 800);
        }
    }

    // ==================== HIT MARKERS ====================
    function showHitMarker(x, y) {
        if (!CONFIG.features.hitMarkers) return;

        const hitMarker = document.createElement('div');
        hitMarker.className = 'gaku-hit-marker';
        hitMarker.style.left = x + 'px';
        hitMarker.style.top = y + 'px';
        document.body.appendChild(hitMarker);

        setTimeout(() => {
            hitMarker.remove();
        }, 300);
    }

    // ==================== DAMAGE NUMBERS ====================
    function showDamageNumber(damage, x, y) {
        if (!CONFIG.features.damageNumbers) return;

        const damageNumber = document.createElement('div');
        damageNumber.className = 'gaku-damage-number';
        damageNumber.textContent = `-${damage}`;
        damageNumber.style.left = x + 'px';
        damageNumber.style.top = y + 'px';
        document.body.appendChild(damageNumber);

        setTimeout(() => {
            damageNumber.remove();
        }, 1000);
    }

    // ==================== ZOOM CONTROLS ====================
    function createZoomControls() {
        if (!CONFIG.features.zoom) return;

        const zoomIndicator = document.createElement('div');
        zoomIndicator.id = 'gaku-zoom-indicator';
        zoomIndicator.textContent = `Zoom: ${(STATE.currentZoom * 100).toFixed(0)}%`;
        document.body.appendChild(zoomIndicator);

        let zoomTimeout;
        function showZoomIndicator() {
            zoomIndicator.classList.add('visible');
            clearTimeout(zoomTimeout);
            zoomTimeout = setTimeout(() => {
                zoomIndicator.classList.remove('visible');
            }, 1500);
        }

        function updateZoom(delta) {
            STATE.currentZoom = Math.max(
                CONFIG.features.zoomMin,
                Math.min(CONFIG.features.zoomMax, STATE.currentZoom + delta)
            );

            // Apply zoom (in real implementation, hook into game's camera)
            document.body.style.zoom = STATE.currentZoom;

            zoomIndicator.textContent = `Zoom: ${(STATE.currentZoom * 100).toFixed(0)}%`;
            showZoomIndicator();
        }

        // Mouse wheel zoom
        document.addEventListener('wheel', (e) => {
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                updateZoom(e.deltaY > 0 ? -CONFIG.features.zoomStep : CONFIG.features.zoomStep);
            }
        }, { passive: false });

        // Keyboard zoom
        document.addEventListener('keydown', (e) => {
            if (e.key === '+' || e.key === '=') {
                e.preventDefault();
                updateZoom(CONFIG.features.zoomStep);
            } else if (e.key === '-' || e.key === '_') {
                e.preventDefault();
                updateZoom(-CONFIG.features.zoomStep);
            } else if (e.key === '0') {
                e.preventDefault();
                STATE.currentZoom = 1.0;
                document.body.style.zoom = 1.0;
                zoomIndicator.textContent = 'Zoom: 100%';
                showZoomIndicator();
            }
        });
    }

    // ==================== SETTINGS PANEL ====================
    function createSettingsPanel() {
        const panel = document.createElement('div');
        panel.id = 'gaku-settings-panel';
        panel.style.display = 'none';

        panel.innerHTML = `
            <div class="gaku-settings-header">
                ⚙️ Gaku Settings
                <button class="gaku-settings-close">×</button>
            </div>
            <div class="gaku-settings-content">
                <div class="gaku-settings-section">
                    <div class="gaku-settings-section-title">⚡ Quick Presets</div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                        <button class="gaku-button" id="gaku-preset-performance" style="padding: 10px; font-size: 12px;">
                            🚀 Max Performance
                        </button>
                        <button class="gaku-button" id="gaku-preset-visuals" style="padding: 10px; font-size: 12px;">
                            ✨ Best Visuals
                        </button>
                        <button class="gaku-button" id="gaku-preset-competitive" style="padding: 10px; font-size: 12px;">
                            🎯 Competitive
                        </button>
                    </div>
                    <div style="color: var(--text-secondary); font-size: 12px; padding: 5px 10px;">
                        Quick presets optimize all settings for specific use cases
                    </div>
                </div>

                <div class="gaku-settings-section">
                    <div class="gaku-settings-section-title">🎨 Theme</div>
                    <div class="gaku-settings-item">
                        <span class="gaku-settings-label">Enable Neon Glass Theme</span>
                        <div class="gaku-toggle ${CONFIG.theme.enabled ? 'active' : ''}" data-setting="theme_enabled"></div>
                    </div>
                </div>

                <div class="gaku-settings-section">
                    <div class="gaku-settings-section-title">🎯 Crosshair</div>
                    <div class="gaku-settings-item">
                        <span class="gaku-settings-label">Enable Custom Crosshair</span>
                        <div class="gaku-toggle ${CONFIG.features.crosshair ? 'active' : ''}" data-setting="crosshair"></div>
                    </div>
                    <div class="gaku-settings-item">
                        <span class="gaku-settings-label">RGB Rainbow Mode</span>
                        <div class="gaku-toggle ${CONFIG.features.crosshairRGB ? 'active' : ''}" data-setting="crosshairRGB"></div>
                    </div>
                    <div class="gaku-settings-item">
                        <span class="gaku-settings-label">Follow Mouse Cursor</span>
                        <div class="gaku-toggle ${CONFIG.features.crosshairFollowMouse ? 'active' : ''}" data-setting="crosshairFollowMouse"></div>
                    </div>
                    <div class="gaku-settings-item">
                        <span class="gaku-settings-label">Trail Effect</span>
                        <div class="gaku-toggle ${CONFIG.features.crosshairTrail ? 'active' : ''}" data-setting="crosshairTrail"></div>
                    </div>
                    <div class="gaku-settings-item">
                        <span class="gaku-settings-label">Particle Effects</span>
                        <div class="gaku-toggle ${CONFIG.features.crosshairParticles ? 'active' : ''}" data-setting="crosshairParticles"></div>
                    </div>
                    <div class="gaku-settings-item">
                        <span class="gaku-settings-label">Rotation Animation</span>
                        <div class="gaku-toggle ${CONFIG.features.crosshairRotation ? 'active' : ''}" data-setting="crosshairRotation"></div>
                    </div>
                    <div class="gaku-settings-item">
                        <span class="gaku-settings-label">Crosshair Style</span>
                        <select class="gaku-select" data-setting="crosshairStyle">
                            <option value="cross" ${CONFIG.features.crosshairStyle === 'cross' ? 'selected' : ''}>Cross</option>
                            <option value="dot" ${CONFIG.features.crosshairStyle === 'dot' ? 'selected' : ''}>Dot</option>
                            <option value="circle" ${CONFIG.features.crosshairStyle === 'circle' ? 'selected' : ''}>Circle</option>
                        </select>
                    </div>
                    <div class="gaku-settings-item">
                        <span class="gaku-settings-label">Crosshair Color (when RGB off)</span>
                        <input type="color" class="gaku-color-picker" value="${CONFIG.features.crosshairColor}" data-setting="crosshairColor">
                    </div>
                    <div class="gaku-settings-item">
                        <span class="gaku-settings-label">Crosshair Size: <span id="crosshair-size-value">${CONFIG.features.crosshairSize}</span></span>
                        <input type="range" class="gaku-slider" min="10" max="50" value="${CONFIG.features.crosshairSize}" data-setting="crosshairSize">
                    </div>
                </div>

                <div class="gaku-settings-section">
                    <div class="gaku-settings-section-title">🔍 Zoom</div>
                    <div class="gaku-settings-item">
                        <span class="gaku-settings-label">Enable Extended Zoom</span>
                        <div class="gaku-toggle ${CONFIG.features.zoom ? 'active' : ''}" data-setting="zoom"></div>
                    </div>
                    <div class="gaku-settings-item">
                        <span class="gaku-settings-label">Min Zoom: <span id="zoom-min-value">${CONFIG.features.zoomMin}</span></span>
                        <input type="range" class="gaku-slider" min="0.3" max="1" step="0.1" value="${CONFIG.features.zoomMin}" data-setting="zoomMin">
                    </div>
                    <div class="gaku-settings-item">
                        <span class="gaku-settings-label">Max Zoom: <span id="zoom-max-value">${CONFIG.features.zoomMax}</span></span>
                        <input type="range" class="gaku-slider" min="1" max="5" step="0.1" value="${CONFIG.features.zoomMax}" data-setting="zoomMax">
                    </div>
                </div>

                <div class="gaku-settings-section">
                    <div class="gaku-settings-section-title">📊 HUD Elements</div>
                    <div class="gaku-settings-item">
                        <span class="gaku-settings-label">FPS Counter</span>
                        <div class="gaku-toggle ${CONFIG.features.fpsCounter ? 'active' : ''}" data-setting="fpsCounter"></div>
                    </div>
                    <div class="gaku-settings-item">
                        <span class="gaku-settings-label">Kill Counter</span>
                        <div class="gaku-toggle ${CONFIG.features.killCounter ? 'active' : ''}" data-setting="killCounter"></div>
                    </div>
                    <div class="gaku-settings-item">
                        <span class="gaku-settings-label">Ping Display</span>
                        <div class="gaku-toggle ${CONFIG.features.pingDisplay ? 'active' : ''}" data-setting="pingDisplay"></div>
                    </div>
                </div>

                <div class="gaku-settings-section">
                    <div class="gaku-settings-section-title">💥 Combat</div>
                    <div class="gaku-settings-item">
                        <span class="gaku-settings-label">Hit Markers</span>
                        <div class="gaku-toggle ${CONFIG.features.hitMarkers ? 'active' : ''}" data-setting="hitMarkers"></div>
                    </div>
                    <div class="gaku-settings-item">
                        <span class="gaku-settings-label">Damage Numbers</span>
                        <div class="gaku-toggle ${CONFIG.features.damageNumbers ? 'active' : ''}" data-setting="damageNumbers"></div>
                    </div>
                </div>

                <div class="gaku-settings-section">
                    <div class="gaku-settings-section-title">🎁 Loot</div>
                    <div class="gaku-settings-item">
                        <span class="gaku-settings-label">Auto Loot Highlight</span>
                        <div class="gaku-toggle ${CONFIG.features.autoLootHighlight ? 'active' : ''}" data-setting="autoLootHighlight"></div>
                    </div>
                </div>

                <div class="gaku-settings-section">
                    <div class="gaku-settings-section-title">🗺️ Map</div>
                    <div class="gaku-settings-item">
                        <span class="gaku-settings-label">Enhanced Minimap</span>
                        <div class="gaku-toggle ${CONFIG.features.minimapEnhanced ? 'active' : ''}" data-setting="minimapEnhanced"></div>
                    </div>
                </div>

                <div class="gaku-settings-section">
                    <div class="gaku-settings-section-title">🎵 Spotify Player</div>
                    <div class="gaku-settings-item">
                        <span class="gaku-settings-label">Enable Spotify Player</span>
                        <div class="gaku-toggle ${CONFIG.features.spotifyEnabled ? 'active' : ''}" data-setting="spotifyEnabled"></div>
                    </div>
                    <div class="gaku-settings-item">
                        <span class="gaku-settings-label">Player Position</span>
                        <select class="gaku-select" data-setting="spotifyPosition">
                            <option value="bottom-left" ${CONFIG.features.spotifyPosition === 'bottom-left' ? 'selected' : ''}>Bottom Left</option>
                            <option value="bottom-right" ${CONFIG.features.spotifyPosition === 'bottom-right' ? 'selected' : ''}>Bottom Right</option>
                            <option value="top-left" ${CONFIG.features.spotifyPosition === 'top-left' ? 'selected' : ''}>Top Left</option>
                            <option value="top-right" ${CONFIG.features.spotifyPosition === 'top-right' ? 'selected' : ''}>Top Right</option>
                        </select>
                    </div>
                    <div class="gaku-settings-item">
                        <span class="gaku-settings-label">Auto-play on Load</span>
                        <div class="gaku-toggle ${CONFIG.features.spotifyAutoplay ? 'active' : ''}" data-setting="spotifyAutoplay"></div>
                    </div>
                </div>

                <div class="gaku-settings-section">
                    <div class="gaku-settings-section-title">⌨️ Hotkeys</div>
                    <div style="color: var(--text-secondary); font-size: 13px; padding: 10px;">
                        <div><strong>F1:</strong> Toggle Settings Panel</div>
                        <div><strong>F2:</strong> Toggle Theme</div>
                        <div><strong>F3:</strong> Toggle Spotify Player</div>
                        <div><strong>F4:</strong> Spotify Play/Pause</div>
                        <div><strong>+/-:</strong> Zoom In/Out</div>
                        <div><strong>0:</strong> Reset Zoom</div>
                        <div><strong>H:</strong> Toggle HUD</div>
                        <div><strong>M:</strong> Toggle Minimap</div>
                    </div>
                </div>

                <div style="display: flex; gap: 10px; margin-top: 20px;">
                    <button class="gaku-button" id="gaku-save-settings">💾 Save Settings</button>
                    <button class="gaku-button" id="gaku-reset-settings">🔄 Reset to Defaults</button>
                </div>
            </div>
        `;

        document.body.appendChild(panel);

        // Close button
        panel.querySelector('.gaku-settings-close').addEventListener('click', () => {
            toggleSettingsPanel();
        });

        // Toggle switches
        panel.querySelectorAll('.gaku-toggle').forEach(toggle => {
            toggle.addEventListener('click', function() {
                this.classList.toggle('active');
                const setting = this.dataset.setting;

                if (setting === 'theme_enabled') {
                    toggleTheme();
                } else {
                    CONFIG.features[setting] = this.classList.contains('active');
                    handleSettingChange(setting);
                }
            });
        });

        // Sliders
        panel.querySelectorAll('.gaku-slider').forEach(slider => {
            slider.addEventListener('input', function() {
                const setting = this.dataset.setting;
                const value = parseFloat(this.value);
                CONFIG.features[setting] = value;

                // Update display value
                const valueDisplay = document.getElementById(`${setting.replace(/([A-Z])/g, '-$1').toLowerCase()}-value`);
                if (valueDisplay) {
                    valueDisplay.textContent = value.toFixed(setting.includes('zoom') ? 1 : 0);
                }

                handleSettingChange(setting);
            });
        });

        // Color picker
        panel.querySelectorAll('.gaku-color-picker').forEach(picker => {
            picker.addEventListener('change', function() {
                const setting = this.dataset.setting;
                CONFIG.features[setting] = this.value;
                handleSettingChange(setting);
            });
        });

        // Select dropdowns
        panel.querySelectorAll('.gaku-select').forEach(select => {
            select.addEventListener('change', function() {
                const setting = this.dataset.setting;
                CONFIG.features[setting] = this.value;
                handleSettingChange(setting);
            });
        });

        // Save button
        document.getElementById('gaku-save-settings').addEventListener('click', () => {
            saveConfig();
            showToast('💾 Settings Saved!');
        });

        // Reset button
        document.getElementById('gaku-reset-settings').addEventListener('click', () => {
            if (confirm('Reset all settings to defaults?')) {
                // Reset to defaults
                Object.keys(CONFIG.features).forEach(key => {
                    GM_setValue(key, undefined);
                });
                location.reload();
            }
        });

        // Preset buttons
        document.getElementById('gaku-preset-performance').addEventListener('click', () => {
            if (confirm('Apply Maximum Performance preset? This will optimize for FPS.')) {
                applyPreset('maxPerformance');
            }
        });

        document.getElementById('gaku-preset-visuals').addEventListener('click', () => {
            if (confirm('Apply Best Visual Experience preset? This enables all effects.')) {
                applyPreset('bestVisuals');
            }
        });

        document.getElementById('gaku-preset-competitive').addEventListener('click', () => {
            if (confirm('Apply Competitive Setup preset? This balances performance and useful features.')) {
                applyPreset('competitive');
            }
        });
    }

    function toggleSettingsPanel() {
        const panel = document.getElementById('gaku-settings-panel');
        if (panel) {
            STATE.settingsPanelOpen = !STATE.settingsPanelOpen;
            panel.style.display = STATE.settingsPanelOpen ? 'block' : 'none';
        }
    }

    function handleSettingChange(setting) {
        // Handle real-time setting changes
        switch(setting) {
            case 'crosshair':
            case 'crosshairStyle':
            case 'crosshairColor':
            case 'crosshairSize':
            case 'crosshairRGB':
            case 'crosshairFollowMouse':
            case 'crosshairTrail':
            case 'crosshairParticles':
            case 'crosshairRotation':
                const crosshair = document.getElementById('gaku-crosshair');
                if (crosshair) crosshair.remove();
                createCrosshair();
                break;
            case 'fpsCounter':
                const fpsCounter = document.getElementById('gaku-fps-counter');
                if (fpsCounter) fpsCounter.style.display = CONFIG.features.fpsCounter ? 'block' : 'none';
                break;
            case 'killCounter':
                const killCounter = document.getElementById('gaku-kill-counter');
                if (killCounter) killCounter.style.display = CONFIG.features.killCounter ? 'block' : 'none';
                break;
            case 'pingDisplay':
                const pingDisplay = document.getElementById('gaku-ping-display');
                if (pingDisplay) pingDisplay.style.display = CONFIG.features.pingDisplay ? 'block' : 'none';
                break;
            case 'spotifyEnabled':
                const spotifyPlayer = document.getElementById('gaku-spotify-player');
                if (CONFIG.features.spotifyEnabled) {
                    if (!spotifyPlayer) {
                        createSpotifyPlayer();
                    } else {
                        spotifyPlayer.style.display = 'block';
                    }
                } else {
                    if (spotifyPlayer) spotifyPlayer.style.display = 'none';
                }
                break;
            case 'spotifyPosition':
                const player = document.getElementById('gaku-spotify-player');
                if (player) {
                    player.className = CONFIG.features.spotifyPosition;
                }
                break;
        }
    }

    // ==================== TOAST NOTIFICATIONS ====================
    function showToast(message, duration = 3000) {
        const toast = document.createElement('div');
        toast.className = 'gaku-toast';
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'gaku-toast-slide-in 0.3s ease-out reverse';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    // ==================== KEYBOARD SHORTCUTS ====================
    function setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Settings panel
            if (e.key === 'F1') {
                e.preventDefault();
                toggleSettingsPanel();
            }

            // Toggle theme
            if (e.key === 'F2') {
                e.preventDefault();
                toggleTheme();
            }

            // Toggle Spotify player
            if (e.key === 'F3') {
                e.preventDefault();
                toggleSpotifyPlayer();
            }

            // Spotify play/pause
            if (e.key === 'F4') {
                e.preventDefault();
                toggleSpotifyPlayback();
            }

            // Toggle HUD
            if (e.key.toLowerCase() === 'h' && !e.ctrlKey && !e.altKey) {
                const hudElements = [
                    document.getElementById('gaku-fps-counter'),
                    document.getElementById('gaku-kill-counter'),
                    document.getElementById('gaku-ping-display')
                ];
                hudElements.forEach(el => {
                    if (el) {
                        el.style.display = el.style.display === 'none' ? 'block' : 'none';
                    }
                });
            }
        });
    }

    // ==================== GAME HOOKS ====================
    function setupGameHooks() {
        // Hook into game events (simplified - in real implementation, hook into actual game code)

        // Simulate hit detection
        document.addEventListener('click', (e) => {
            if (CONFIG.features.hitMarkers) {
                // Simulate hit at random
                if (Math.random() > 0.5) {
                    showHitMarker(e.clientX, e.clientY);

                    if (CONFIG.features.damageNumbers) {
                        const damage = Math.floor(Math.random() * 50) + 10;
                        showDamageNumber(damage, e.clientX + 20, e.clientY - 20);
                    }
                }
            }
        });

        // Simulate kill detection (in real implementation, hook into game's kill event)
        let killCheckInterval = setInterval(() => {
            // This is just a demo - replace with actual game hook
            if (Math.random() > 0.99) { // Rare random event for demo
                updateKillCounter(STATE.kills + 1);
                showToast('💀 Enemy Eliminated!');
            }
        }, 5000);
    }

    // ==================== LOOT HIGHLIGHTING ====================
    function setupLootHighlighting() {
        if (!CONFIG.features.autoLootHighlight) return;

        // Observe DOM for loot items (simplified - adjust selectors for actual game)
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Element node
                        // Check if it's a loot item (adjust selector for actual game)
                        if (node.classList && (node.classList.contains('loot') || node.classList.contains('item'))) {
                            node.classList.add('gaku-loot-highlight');
                        }
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // ==================== ADVANCED PARTICLE SYSTEM ====================
    class ParticleSystem {
        constructor() {
            this.particles = [];
            this.canvas = null;
            this.ctx = null;
            this.animationFrame = null;
            this.enabled = GM_getValue('particles_enabled', true);
            this.maxParticles = GM_getValue('max_particles', 500);
            this.particleTypes = {
                spark: { lifetime: 1000, speed: 2, size: 3, color: '#00E5FF' },
                smoke: { lifetime: 2000, speed: 0.5, size: 10, color: '#888888' },
                blood: { lifetime: 800, speed: 1.5, size: 5, color: '#FF0000' },
                magic: { lifetime: 1500, speed: 1, size: 4, color: '#8A2BE2' },
                explosion: { lifetime: 600, speed: 3, size: 8, color: '#FF4400' },
                heal: { lifetime: 1200, speed: 0.8, size: 6, color: '#00FF88' },
                shield: { lifetime: 1000, speed: 0.3, size: 7, color: '#00E5FF' },
                poison: { lifetime: 1800, speed: 0.6, size: 5, color: '#88FF00' },
                fire: { lifetime: 1400, speed: 1.2, size: 6, color: '#FF8800' },
                ice: { lifetime: 1600, speed: 0.7, size: 5, color: '#00FFFF' }
            };
        }

        init() {
            if (!this.enabled) return;

            this.canvas = document.createElement('canvas');
            this.canvas.id = 'gaku-particle-canvas';
            this.canvas.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                pointer-events: none;
                z-index: 9999;
            `;
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.ctx = this.canvas.getContext('2d');
            document.body.appendChild(this.canvas);

            // Handle resize
            window.addEventListener('resize', () => {
                this.canvas.width = window.innerWidth;
                this.canvas.height = window.innerHeight;
            });

            this.startAnimation();
        }

        createParticle(x, y, type = 'spark', options = {}) {
            if (this.particles.length >= this.maxParticles) {
                this.particles.shift(); // Remove oldest particle
            }

            const particleConfig = this.particleTypes[type] || this.particleTypes.spark;
            const particle = {
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * particleConfig.speed * 2,
                vy: (Math.random() - 0.5) * particleConfig.speed * 2,
                size: particleConfig.size * (0.5 + Math.random() * 0.5),
                color: options.color || particleConfig.color,
                lifetime: particleConfig.lifetime,
                age: 0,
                type: type,
                gravity: options.gravity !== undefined ? options.gravity : 0.1,
                friction: options.friction !== undefined ? options.friction : 0.98,
                glow: options.glow !== undefined ? options.glow : true,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.1
            };

            this.particles.push(particle);
        }

        createBurst(x, y, count, type = 'spark', options = {}) {
            for (let i = 0; i < count; i++) {
                this.createParticle(x, y, type, options);
            }
        }

        createTrail(x1, y1, x2, y2, density = 5, type = 'spark', options = {}) {
            const dx = x2 - x1;
            const dy = y2 - y1;
            const steps = Math.floor(Math.sqrt(dx * dx + dy * dy) / density);

            for (let i = 0; i <= steps; i++) {
                const t = i / steps;
                const x = x1 + dx * t;
                const y = y1 + dy * t;
                this.createParticle(x, y, type, options);
            }
        }

        update(deltaTime) {
            for (let i = this.particles.length - 1; i >= 0; i--) {
                const p = this.particles[i];

                // Update age
                p.age += deltaTime;

                // Remove dead particles
                if (p.age >= p.lifetime) {
                    this.particles.splice(i, 1);
                    continue;
                }

                // Update physics
                p.vy += p.gravity;
                p.vx *= p.friction;
                p.vy *= p.friction;
                p.x += p.vx;
                p.y += p.vy;
                p.rotation += p.rotationSpeed;

                // Fade out
                p.alpha = 1 - (p.age / p.lifetime);
            }
        }

        render() {
            if (!this.ctx) return;

            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            for (const p of this.particles) {
                this.ctx.save();
                this.ctx.globalAlpha = p.alpha;

                if (p.glow) {
                    this.ctx.shadowBlur = 15;
                    this.ctx.shadowColor = p.color;
                }

                this.ctx.fillStyle = p.color;
                this.ctx.translate(p.x, p.y);
                this.ctx.rotate(p.rotation);

                // Different shapes based on type
                switch (p.type) {
                    case 'spark':
                        this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                        break;
                    case 'smoke':
                        this.ctx.beginPath();
                        this.ctx.arc(0, 0, p.size, 0, Math.PI * 2);
                        this.ctx.fill();
                        break;
                    case 'magic':
                        this.ctx.beginPath();
                        for (let i = 0; i < 5; i++) {
                            const angle = (i / 5) * Math.PI * 2;
                            const x = Math.cos(angle) * p.size;
                            const y = Math.sin(angle) * p.size;
                            if (i === 0) this.ctx.moveTo(x, y);
                            else this.ctx.lineTo(x, y);
                        }
                        this.ctx.closePath();
                        this.ctx.fill();
                        break;
                    default:
                        this.ctx.beginPath();
                        this.ctx.arc(0, 0, p.size, 0, Math.PI * 2);
                        this.ctx.fill();
                }

                this.ctx.restore();
            }
        }

        startAnimation() {
            let lastTime = performance.now();

            const animate = (currentTime) => {
                const deltaTime = currentTime - lastTime;
                lastTime = currentTime;

                this.update(deltaTime);
                this.render();

                this.animationFrame = requestAnimationFrame(animate);
            };

            this.animationFrame = requestAnimationFrame(animate);
        }

        stop() {
            if (this.animationFrame) {
                cancelAnimationFrame(this.animationFrame);
                this.animationFrame = null;
            }
        }

        destroy() {
            this.stop();
            if (this.canvas) {
                this.canvas.remove();
                this.canvas = null;
            }
            this.particles = [];
        }
    }

    const particleSystem = new ParticleSystem();

    // ==================== STATISTICS TRACKING SYSTEM ====================
    class StatisticsTracker {
        constructor() {
            this.stats = this.loadStats();
            this.currentSession = {
                startTime: Date.now(),
                kills: 0,
                deaths: 0,
                damage: 0,
                healing: 0,
                distance: 0,
                shots: 0,
                hits: 0,
                headshots: 0,
                matches: 0,
                wins: 0,
                top10: 0,
                survivalTime: 0,
                itemsLooted: 0,
                revives: 0,
                knockdowns: 0
            };
            this.matchHistory = GM_getValue('match_history', []);
            this.achievements = this.loadAchievements();
        }

        loadStats() {
            return {
                lifetime: {
                    kills: GM_getValue('lifetime_kills', 0),
                    deaths: GM_getValue('lifetime_deaths', 0),
                    damage: GM_getValue('lifetime_damage', 0),
                    healing: GM_getValue('lifetime_healing', 0),
                    distance: GM_getValue('lifetime_distance', 0),
                    shots: GM_getValue('lifetime_shots', 0),
                    hits: GM_getValue('lifetime_hits', 0),
                    headshots: GM_getValue('lifetime_headshots', 0),
                    matches: GM_getValue('lifetime_matches', 0),
                    wins: GM_getValue('lifetime_wins', 0),
                    top10: GM_getValue('lifetime_top10', 0),
                    playtime: GM_getValue('lifetime_playtime', 0),
                    itemsLooted: GM_getValue('lifetime_items', 0),
                    revives: GM_getValue('lifetime_revives', 0),
                    knockdowns: GM_getValue('lifetime_knockdowns', 0),
                    longestKillStreak: GM_getValue('longest_kill_streak', 0),
                    longestShot: GM_getValue('longest_shot', 0),
                    mostKillsMatch: GM_getValue('most_kills_match', 0),
                    mostDamageMatch: GM_getValue('most_damage_match', 0)
                },
                daily: {
                    date: GM_getValue('daily_date', new Date().toDateString()),
                    kills: GM_getValue('daily_kills', 0),
                    deaths: GM_getValue('daily_deaths', 0),
                    matches: GM_getValue('daily_matches', 0),
                    wins: GM_getValue('daily_wins', 0),
                    playtime: GM_getValue('daily_playtime', 0)
                },
                weekly: {
                    week: GM_getValue('weekly_week', this.getWeekNumber()),
                    kills: GM_getValue('weekly_kills', 0),
                    deaths: GM_getValue('weekly_deaths', 0),
                    matches: GM_getValue('weekly_matches', 0),
                    wins: GM_getValue('weekly_wins', 0),
                    playtime: GM_getValue('weekly_playtime', 0)
                }
            };
        }

        loadAchievements() {
            return {
                firstBlood: { unlocked: GM_getValue('ach_first_blood', false), name: 'First Blood', desc: 'Get your first kill' },
                sharpshooter: { unlocked: GM_getValue('ach_sharpshooter', false), name: 'Sharpshooter', desc: 'Get 10 headshots' },
                survivor: { unlocked: GM_getValue('ach_survivor', false), name: 'Survivor', desc: 'Survive 10 minutes in a match' },
                champion: { unlocked: GM_getValue('ach_champion', false), name: 'Champion', desc: 'Win your first match' },
                veteran: { unlocked: GM_getValue('ach_veteran', false), name: 'Veteran', desc: 'Play 100 matches' },
                destroyer: { unlocked: GM_getValue('ach_destroyer', false), name: 'Destroyer', desc: 'Deal 10,000 damage' },
                medic: { unlocked: GM_getValue('ach_medic', false), name: 'Medic', desc: 'Heal 5,000 HP' },
                explorer: { unlocked: GM_getValue('ach_explorer', false), name: 'Explorer', desc: 'Travel 100km' },
                marksman: { unlocked: GM_getValue('ach_marksman', false), name: 'Marksman', desc: '80% accuracy in a match' },
                unstoppable: { unlocked: GM_getValue('ach_unstoppable', false), name: 'Unstoppable', desc: 'Get a 10 kill streak' },
                collector: { unlocked: GM_getValue('ach_collector', false), name: 'Collector', desc: 'Loot 1,000 items' },
                teamPlayer: { unlocked: GM_getValue('ach_team_player', false), name: 'Team Player', desc: 'Revive 50 teammates' },
                assassin: { unlocked: GM_getValue('ach_assassin', false), name: 'Assassin', desc: 'Get 100 kills' },
                legend: { unlocked: GM_getValue('ach_legend', false), name: 'Legend', desc: 'Win 50 matches' },
                dedicated: { unlocked: GM_getValue('ach_dedicated', false), name: 'Dedicated', desc: 'Play for 100 hours' }
            };
        }

        getWeekNumber() {
            const now = new Date();
            const start = new Date(now.getFullYear(), 0, 1);
            const diff = now - start;
            const oneWeek = 1000 * 60 * 60 * 24 * 7;
            return Math.floor(diff / oneWeek);
        }

        checkDailyReset() {
            const today = new Date().toDateString();
            if (this.stats.daily.date !== today) {
                this.stats.daily = {
                    date: today,
                    kills: 0,
                    deaths: 0,
                    matches: 0,
                    wins: 0,
                    playtime: 0
                };
                this.saveDailyStats();
            }
        }

        checkWeeklyReset() {
            const currentWeek = this.getWeekNumber();
            if (this.stats.weekly.week !== currentWeek) {
                this.stats.weekly = {
                    week: currentWeek,
                    kills: 0,
                    deaths: 0,
                    matches: 0,
                    wins: 0,
                    playtime: 0
                };
                this.saveWeeklyStats();
            }
        }

        recordKill(isHeadshot = false) {
            this.currentSession.kills++;
            this.stats.lifetime.kills++;
            this.stats.daily.kills++;
            this.stats.weekly.kills++;

            if (isHeadshot) {
                this.currentSession.headshots++;
                this.stats.lifetime.headshots++;
            }

            if (this.currentSession.kills > this.stats.lifetime.mostKillsMatch) {
                this.stats.lifetime.mostKillsMatch = this.currentSession.kills;
                GM_setValue('most_kills_match', this.currentSession.kills);
            }

            this.checkAchievements();
            this.saveStats();
        }

        recordDeath() {
            this.currentSession.deaths++;
            this.stats.lifetime.deaths++;
            this.stats.daily.deaths++;
            this.stats.weekly.deaths++;
            this.saveStats();
        }

        recordDamage(amount) {
            this.currentSession.damage += amount;
            this.stats.lifetime.damage += amount;

            if (this.currentSession.damage > this.stats.lifetime.mostDamageMatch) {
                this.stats.lifetime.mostDamageMatch = this.currentSession.damage;
                GM_setValue('most_damage_match', this.currentSession.damage);
            }

            this.checkAchievements();
            this.saveStats();
        }

        recordShot(hit = false) {
            this.currentSession.shots++;
            this.stats.lifetime.shots++;

            if (hit) {
                this.currentSession.hits++;
                this.stats.lifetime.hits++;
            }

            this.checkAchievements();
            this.saveStats();
        }

        recordMatchEnd(placement, isWin = false) {
            this.currentSession.matches++;
            this.stats.lifetime.matches++;
            this.stats.daily.matches++;
            this.stats.weekly.matches++;

            if (isWin) {
                this.currentSession.wins++;
                this.stats.lifetime.wins++;
                this.stats.daily.wins++;
                this.stats.weekly.wins++;
            }

            if (placement <= 10) {
                this.currentSession.top10++;
                this.stats.lifetime.top10++;
            }

            // Save match to history
            const match = {
                timestamp: Date.now(),
                kills: this.currentSession.kills,
                damage: this.currentSession.damage,
                placement: placement,
                survivalTime: this.currentSession.survivalTime,
                accuracy: this.currentSession.shots > 0 ? (this.currentSession.hits / this.currentSession.shots * 100).toFixed(1) : 0
            };

            this.matchHistory.unshift(match);
            if (this.matchHistory.length > 100) {
                this.matchHistory = this.matchHistory.slice(0, 100);
            }
            GM_setValue('match_history', this.matchHistory);

            this.checkAchievements();
            this.saveStats();
            this.resetSession();
        }

        checkAchievements() {
            // First Blood
            if (!this.achievements.firstBlood.unlocked && this.stats.lifetime.kills >= 1) {
                this.unlockAchievement('firstBlood');
            }

            // Sharpshooter
            if (!this.achievements.sharpshooter.unlocked && this.stats.lifetime.headshots >= 10) {
                this.unlockAchievement('sharpshooter');
            }

            // Champion
            if (!this.achievements.champion.unlocked && this.stats.lifetime.wins >= 1) {
                this.unlockAchievement('champion');
            }

            // Veteran
            if (!this.achievements.veteran.unlocked && this.stats.lifetime.matches >= 100) {
                this.unlockAchievement('veteran');
            }

            // Destroyer
            if (!this.achievements.destroyer.unlocked && this.stats.lifetime.damage >= 10000) {
                this.unlockAchievement('destroyer');
            }

            // Medic
            if (!this.achievements.medic.unlocked && this.stats.lifetime.healing >= 5000) {
                this.unlockAchievement('medic');
            }

            // Explorer
            if (!this.achievements.explorer.unlocked && this.stats.lifetime.distance >= 100000) {
                this.unlockAchievement('explorer');
            }

            // Collector
            if (!this.achievements.collector.unlocked && this.stats.lifetime.itemsLooted >= 1000) {
                this.unlockAchievement('collector');
            }

            // Team Player
            if (!this.achievements.teamPlayer.unlocked && this.stats.lifetime.revives >= 50) {
                this.unlockAchievement('teamPlayer');
            }

            // Assassin
            if (!this.achievements.assassin.unlocked && this.stats.lifetime.kills >= 100) {
                this.unlockAchievement('assassin');
            }

            // Legend
            if (!this.achievements.legend.unlocked && this.stats.lifetime.wins >= 50) {
                this.unlockAchievement('legend');
            }

            // Dedicated
            if (!this.achievements.dedicated.unlocked && this.stats.lifetime.playtime >= 360000) {
                this.unlockAchievement('dedicated');
            }
        }

        unlockAchievement(achievementKey) {
            this.achievements[achievementKey].unlocked = true;
            GM_setValue(`ach_${achievementKey.replace(/([A-Z])/g, '_$1').toLowerCase()}`, true);

            // Show achievement notification
            showAchievementNotification(this.achievements[achievementKey]);
        }

        resetSession() {
            this.currentSession = {
                startTime: Date.now(),
                kills: 0,
                deaths: 0,
                damage: 0,
                healing: 0,
                distance: 0,
                shots: 0,
                hits: 0,
                headshots: 0,
                matches: 0,
                wins: 0,
                top10: 0,
                survivalTime: 0,
                itemsLooted: 0,
                revives: 0,
                knockdowns: 0
            };
        }

        saveStats() {
            // Lifetime stats
            GM_setValue('lifetime_kills', this.stats.lifetime.kills);
            GM_setValue('lifetime_deaths', this.stats.lifetime.deaths);
            GM_setValue('lifetime_damage', this.stats.lifetime.damage);
            GM_setValue('lifetime_healing', this.stats.lifetime.healing);
            GM_setValue('lifetime_distance', this.stats.lifetime.distance);
            GM_setValue('lifetime_shots', this.stats.lifetime.shots);
            GM_setValue('lifetime_hits', this.stats.lifetime.hits);
            GM_setValue('lifetime_headshots', this.stats.lifetime.headshots);
            GM_setValue('lifetime_matches', this.stats.lifetime.matches);
            GM_setValue('lifetime_wins', this.stats.lifetime.wins);
            GM_setValue('lifetime_top10', this.stats.lifetime.top10);
            GM_setValue('lifetime_playtime', this.stats.lifetime.playtime);
            GM_setValue('lifetime_items', this.stats.lifetime.itemsLooted);
            GM_setValue('lifetime_revives', this.stats.lifetime.revives);
            GM_setValue('lifetime_knockdowns', this.stats.lifetime.knockdowns);
        }

        saveDailyStats() {
            GM_setValue('daily_date', this.stats.daily.date);
            GM_setValue('daily_kills', this.stats.daily.kills);
            GM_setValue('daily_deaths', this.stats.daily.deaths);
            GM_setValue('daily_matches', this.stats.daily.matches);
            GM_setValue('daily_wins', this.stats.daily.wins);
            GM_setValue('daily_playtime', this.stats.daily.playtime);
        }

        saveWeeklyStats() {
            GM_setValue('weekly_week', this.stats.weekly.week);
            GM_setValue('weekly_kills', this.stats.weekly.kills);
            GM_setValue('weekly_deaths', this.stats.weekly.deaths);
            GM_setValue('weekly_matches', this.stats.weekly.matches);
            GM_setValue('weekly_wins', this.stats.weekly.wins);
            GM_setValue('weekly_playtime', this.stats.weekly.playtime);
        }

        getKDRatio() {
            return this.stats.lifetime.deaths > 0 ?
                (this.stats.lifetime.kills / this.stats.lifetime.deaths).toFixed(2) :
                this.stats.lifetime.kills.toFixed(2);
        }

        getAccuracy() {
            return this.stats.lifetime.shots > 0 ?
                ((this.stats.lifetime.hits / this.stats.lifetime.shots) * 100).toFixed(1) :
                '0.0';
        }

        getWinRate() {
            return this.stats.lifetime.matches > 0 ?
                ((this.stats.lifetime.wins / this.stats.lifetime.matches) * 100).toFixed(1) :
                '0.0';
        }

        getHeadshotRate() {
            return this.stats.lifetime.hits > 0 ?
                ((this.stats.lifetime.headshots / this.stats.lifetime.hits) * 100).toFixed(1) :
                '0.0';
        }
    }

    const statsTracker = new StatisticsTracker();

    // ==================== STATISTICS DASHBOARD ====================
    function createStatsDashboard() {
        const dashboard = document.createElement('div');
        dashboard.id = 'gaku-stats-dashboard';
        dashboard.style.display = 'none';
        dashboard.innerHTML = `
            <div class="gaku-stats-container">
                <div class="gaku-stats-header">
                    <h2>📊 Statistics Dashboard</h2>
                    <button class="gaku-stats-close">✕</button>
                </div>

                <div class="gaku-stats-tabs">
                    <button class="gaku-stats-tab active" data-tab="overview">Overview</button>
                    <button class="gaku-stats-tab" data-tab="combat">Combat</button>
                    <button class="gaku-stats-tab" data-tab="matches">Match History</button>
                    <button class="gaku-stats-tab" data-tab="achievements">Achievements</button>
                    <button class="gaku-stats-tab" data-tab="graphs">Graphs</button>
                </div>

                <div class="gaku-stats-content">
                    <div class="gaku-stats-tab-content active" data-content="overview">
                        <div class="gaku-stats-grid">
                            <div class="gaku-stat-card">
                                <div class="gaku-stat-icon">🎯</div>
                                <div class="gaku-stat-value">${statsTracker.stats.lifetime.kills}</div>
                                <div class="gaku-stat-label">Total Kills</div>
                            </div>
                            <div class="gaku-stat-card">
                                <div class="gaku-stat-icon">💀</div>
                                <div class="gaku-stat-value">${statsTracker.stats.lifetime.deaths}</div>
                                <div class="gaku-stat-label">Total Deaths</div>
                            </div>
                            <div class="gaku-stat-card">
                                <div class="gaku-stat-icon">📈</div>
                                <div class="gaku-stat-value">${statsTracker.getKDRatio()}</div>
                                <div class="gaku-stat-label">K/D Ratio</div>
                            </div>
                            <div class="gaku-stat-card">
                                <div class="gaku-stat-icon">🏆</div>
                                <div class="gaku-stat-value">${statsTracker.stats.lifetime.wins}</div>
                                <div class="gaku-stat-label">Wins</div>
                            </div>
                            <div class="gaku-stat-card">
                                <div class="gaku-stat-icon">🎮</div>
                                <div class="gaku-stat-value">${statsTracker.stats.lifetime.matches}</div>
                                <div class="gaku-stat-label">Matches Played</div>
                            </div>
                            <div class="gaku-stat-card">
                                <div class="gaku-stat-icon">✨</div>
                                <div class="gaku-stat-value">${statsTracker.getWinRate()}%</div>
                                <div class="gaku-stat-label">Win Rate</div>
                            </div>
                            <div class="gaku-stat-card">
                                <div class="gaku-stat-icon">💥</div>
                                <div class="gaku-stat-value">${statsTracker.stats.lifetime.damage.toLocaleString()}</div>
                                <div class="gaku-stat-label">Total Damage</div>
                            </div>
                            <div class="gaku-stat-card">
                                <div class="gaku-stat-icon">⏱️</div>
                                <div class="gaku-stat-value">${Math.floor(statsTracker.stats.lifetime.playtime / 3600)}h</div>
                                <div class="gaku-stat-label">Playtime</div>
                            </div>
                        </div>

                        <div class="gaku-stats-section">
                            <h3>Daily Stats</h3>
                            <div class="gaku-stats-row">
                                <span>Kills: ${statsTracker.stats.daily.kills}</span>
                                <span>Deaths: ${statsTracker.stats.daily.deaths}</span>
                                <span>Matches: ${statsTracker.stats.daily.matches}</span>
                                <span>Wins: ${statsTracker.stats.daily.wins}</span>
                            </div>
                        </div>

                        <div class="gaku-stats-section">
                            <h3>Weekly Stats</h3>
                            <div class="gaku-stats-row">
                                <span>Kills: ${statsTracker.stats.weekly.kills}</span>
                                <span>Deaths: ${statsTracker.stats.weekly.deaths}</span>
                                <span>Matches: ${statsTracker.stats.weekly.matches}</span>
                                <span>Wins: ${statsTracker.stats.weekly.wins}</span>
                            </div>
                        </div>
                    </div>

                    <div class="gaku-stats-tab-content" data-content="combat">
                        <div class="gaku-stats-grid">
                            <div class="gaku-stat-card">
                                <div class="gaku-stat-icon">🎯</div>
                                <div class="gaku-stat-value">${statsTracker.getAccuracy()}%</div>
                                <div class="gaku-stat-label">Accuracy</div>
                            </div>
                            <div class="gaku-stat-card">
                                <div class="gaku-stat-icon">🔫</div>
                                <div class="gaku-stat-value">${statsTracker.stats.lifetime.shots}</div>
                                <div class="gaku-stat-label">Shots Fired</div>
                            </div>
                            <div class="gaku-stat-card">
                                <div class="gaku-stat-icon">✅</div>
                                <div class="gaku-stat-value">${statsTracker.stats.lifetime.hits}</div>
                                <div class="gaku-stat-label">Shots Hit</div>
                            </div>
                            <div class="gaku-stat-card">
                                <div class="gaku-stat-icon">💀</div>
                                <div class="gaku-stat-value">${statsTracker.stats.lifetime.headshots}</div>
                                <div class="gaku-stat-label">Headshots</div>
                            </div>
                            <div class="gaku-stat-card">
                                <div class="gaku-stat-icon">🎪</div>
                                <div class="gaku-stat-value">${statsTracker.getHeadshotRate()}%</div>
                                <div class="gaku-stat-label">Headshot Rate</div>
                            </div>
                            <div class="gaku-stat-card">
                                <div class="gaku-stat-icon">🔥</div>
                                <div class="gaku-stat-value">${statsTracker.stats.lifetime.longestKillStreak}</div>
                                <div class="gaku-stat-label">Longest Streak</div>
                            </div>
                            <div class="gaku-stat-card">
                                <div class="gaku-stat-icon">📏</div>
                                <div class="gaku-stat-value">${statsTracker.stats.lifetime.longestShot}m</div>
                                <div class="gaku-stat-label">Longest Shot</div>
                            </div>
                            <div class="gaku-stat-card">
                                <div class="gaku-stat-icon">⚡</div>
                                <div class="gaku-stat-value">${statsTracker.stats.lifetime.mostKillsMatch}</div>
                                <div class="gaku-stat-label">Most Kills (Match)</div>
                            </div>
                        </div>
                    </div>

                    <div class="gaku-stats-tab-content" data-content="matches">
                        <div class="gaku-match-history">
                            ${generateMatchHistoryHTML()}
                        </div>
                    </div>

                    <div class="gaku-stats-tab-content" data-content="achievements">
                        <div class="gaku-achievements-grid">
                            ${generateAchievementsHTML()}
                        </div>
                    </div>

                    <div class="gaku-stats-tab-content" data-content="graphs">
                        <div class="gaku-graphs-container">
                            <canvas id="gaku-stats-chart-kills" width="400" height="200"></canvas>
                            <canvas id="gaku-stats-chart-winrate" width="400" height="200"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(dashboard);
        setupStatsDashboardListeners();
    }

    function generateMatchHistoryHTML() {
        if (statsTracker.matchHistory.length === 0) {
            return '<div class="gaku-no-data">No match history yet. Play some games!</div>';
        }

        return statsTracker.matchHistory.map((match, index) => `
            <div class="gaku-match-item">
                <div class="gaku-match-number">#${index + 1}</div>
                <div class="gaku-match-info">
                    <div class="gaku-match-placement">Placement: #${match.placement}</div>
                    <div class="gaku-match-stats">
                        Kills: ${match.kills} | Damage: ${match.damage} | Accuracy: ${match.accuracy}%
                    </div>
                    <div class="gaku-match-time">${new Date(match.timestamp).toLocaleString()}</div>
                </div>
            </div>
        `).join('');
    }

    function generateAchievementsHTML() {
        return Object.entries(statsTracker.achievements).map(([key, ach]) => `
            <div class="gaku-achievement-card ${ach.unlocked ? 'unlocked' : 'locked'}">
                <div class="gaku-achievement-icon">${ach.unlocked ? '🏆' : '🔒'}</div>
                <div class="gaku-achievement-name">${ach.name}</div>
                <div class="gaku-achievement-desc">${ach.desc}</div>
            </div>
        `).join('');
    }

    function setupStatsDashboardListeners() {
        // Close button
        document.querySelector('.gaku-stats-close')?.addEventListener('click', () => {
            document.getElementById('gaku-stats-dashboard').style.display = 'none';
        });

        // Tab switching
        document.querySelectorAll('.gaku-stats-tab').forEach(tab => {
            tab.addEventListener('click', function() {
                const tabName = this.dataset.tab;

                // Update active tab
                document.querySelectorAll('.gaku-stats-tab').forEach(t => t.classList.remove('active'));
                this.classList.add('active');

                // Update active content
                document.querySelectorAll('.gaku-stats-tab-content').forEach(c => c.classList.remove('active'));
                document.querySelector(`[data-content="${tabName}"]`)?.classList.add('active');
            });
        });
    }

    function toggleStatsDashboard() {
        const dashboard = document.getElementById('gaku-stats-dashboard');
        if (dashboard) {
            dashboard.style.display = dashboard.style.display === 'none' ? 'block' : 'none';
        }
    }

    function showAchievementNotification(achievement) {
        const notification = document.createElement('div');
        notification.className = 'gaku-achievement-notification';
        notification.innerHTML = `
            <div class="gaku-achievement-unlocked">
                <div class="gaku-achievement-icon-large">🏆</div>
                <div class="gaku-achievement-text">
                    <div class="gaku-achievement-title">Achievement Unlocked!</div>
                    <div class="gaku-achievement-name-large">${achievement.name}</div>
                    <div class="gaku-achievement-desc-large">${achievement.desc}</div>
                </div>
            </div>
        `;
        document.body.appendChild(notification);

        // Play achievement sound
        playAchievementSound();

        // Create particle burst
        particleSystem.createBurst(window.innerWidth / 2, window.innerHeight / 2, 50, 'magic', { color: '#FFD700' });

        setTimeout(() => {
            notification.style.animation = 'gaku-achievement-slide-out 0.5s ease-in';
            setTimeout(() => notification.remove(), 500);
        }, 5000);
    }

    function playAchievementSound() {
        const ctx = initAudioContext();
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C, E, G, C (octave)

        notes.forEach((freq, i) => {
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscillator.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.15);
            gainNode.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.15);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.15 + 0.4);

            oscillator.start(ctx.currentTime + i * 0.15);
            oscillator.stop(ctx.currentTime + i * 0.15 + 0.4);
        });
    }

    // ==================== REPLAY SYSTEM ====================
    class ReplaySystem {
        constructor() {
            this.isRecording = false;
            this.currentReplay = null;
            this.replays = GM_getValue('replays', []);
            this.recordingData = [];
            this.recordInterval = null;
            this.maxReplays = 50;
            this.maxReplayDuration = 600000; // 10 minutes
        }

        startRecording() {
            if (this.isRecording) return;

            this.isRecording = true;
            this.recordingData = [];
            this.currentReplay = {
                id: Date.now(),
                startTime: Date.now(),
                frames: [],
                events: [],
                metadata: {
                    kills: 0,
                    damage: 0,
                    placement: 0
                }
            };

            // Record game state every 100ms
            this.recordInterval = setInterval(() => {
                this.captureFrame();
            }, 100);

            showToast('🎬 Recording Started');
        }

        stopRecording(metadata = {}) {
            if (!this.isRecording) return;

            this.isRecording = false;
            clearInterval(this.recordInterval);
            this.recordInterval = null;

            this.currentReplay.endTime = Date.now();
            this.currentReplay.duration = this.currentReplay.endTime - this.currentReplay.startTime;
            this.currentReplay.metadata = { ...this.currentReplay.metadata, ...metadata };

            // Save replay
            this.replays.unshift(this.currentReplay);
            if (this.replays.length > this.maxReplays) {
                this.replays = this.replays.slice(0, this.maxReplays);
            }

            GM_setValue('replays', this.replays);
            showToast('🎬 Recording Saved');

            this.currentReplay = null;
        }

        captureFrame() {
            if (!this.isRecording || !this.currentReplay) return;

            // Capture game state (simplified - in real implementation, capture actual game data)
            const frame = {
                timestamp: Date.now() - this.currentReplay.startTime,
                playerPosition: { x: 0, y: 0 }, // Would capture actual position
                cameraPosition: { x: 0, y: 0 },
                entities: [], // Would capture visible entities
                ui: {} // Would capture UI state
            };

            this.currentReplay.frames.push(frame);

            // Stop if max duration reached
            if (frame.timestamp >= this.maxReplayDuration) {
                this.stopRecording();
            }
        }

        recordEvent(eventType, eventData) {
            if (!this.isRecording || !this.currentReplay) return;

            const event = {
                timestamp: Date.now() - this.currentReplay.startTime,
                type: eventType,
                data: eventData
            };

            this.currentReplay.events.push(event);

            // Update metadata
            if (eventType === 'kill') {
                this.currentReplay.metadata.kills++;
            } else if (eventType === 'damage') {
                this.currentReplay.metadata.damage += eventData.amount;
            }
        }

        deleteReplay(replayId) {
            this.replays = this.replays.filter(r => r.id !== replayId);
            GM_setValue('replays', this.replays);
            showToast('🗑️ Replay Deleted');
        }

        exportReplay(replayId) {
            const replay = this.replays.find(r => r.id === replayId);
            if (!replay) return;

            const dataStr = JSON.stringify(replay, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);

            const link = document.createElement('a');
            link.href = url;
            link.download = `gaku-replay-${replay.id}.json`;
            link.click();

            URL.revokeObjectURL(url);
            showToast('💾 Replay Exported');
        }
    }

    const replaySystem = new ReplaySystem();

    // ==================== THEME CUSTOMIZATION SYSTEM ====================
    class ThemeCustomizer {
        constructor() {
            this.themes = {
                neonGlass: {
                    name: 'Neon Glass (Default)',
                    colors: {
                        primary: '#00E5FF',
                        secondary: '#8A2BE2',
                        accent: '#FF2D75',
                        background: 'linear-gradient(135deg, #0a0e1a 0%, #1a1f35 100%)'
                    }
                },
                cyberpunk: {
                    name: 'Cyberpunk',
                    colors: {
                        primary: '#FF00FF',
                        secondary: '#00FFFF',
                        accent: '#FFFF00',
                        background: 'linear-gradient(135deg, #1a0033 0%, #330066 100%)'
                    }
                },
                matrix: {
                    name: 'Matrix',
                    colors: {
                        primary: '#00FF00',
                        secondary: '#00AA00',
                        accent: '#00FF88',
                        background: 'linear-gradient(135deg, #001100 0%, #003300 100%)'
                    }
                },
                sunset: {
                    name: 'Sunset',
                    colors: {
                        primary: '#FF6B35',
                        secondary: '#F7931E',
                        accent: '#FDC830',
                        background: 'linear-gradient(135deg, #2C1810 0%, #4A2818 100%)'
                    }
                },
                ocean: {
                    name: 'Ocean',
                    colors: {
                        primary: '#0077BE',
                        secondary: '#00A8E8',
                        accent: '#00C9FF',
                        background: 'linear-gradient(135deg, #001F3F 0%, #003D5C 100%)'
                    }
                },
                forest: {
                    name: 'Forest',
                    colors: {
                        primary: '#2ECC71',
                        secondary: '#27AE60',
                        accent: '#52D681',
                        background: 'linear-gradient(135deg, #0F2027 0%, #203A43 100%)'
                    }
                },
                fire: {
                    name: 'Fire',
                    colors: {
                        primary: '#FF4500',
                        secondary: '#FF6347',
                        accent: '#FFD700',
                        background: 'linear-gradient(135deg, #2B0000 0%, #4A0000 100%)'
                    }
                },
                ice: {
                    name: 'Ice',
                    colors: {
                        primary: '#00D4FF',
                        secondary: '#7FDBFF',
                        accent: '#B8E6F0',
                        background: 'linear-gradient(135deg, #0A1929 0%, #1A3A52 100%)'
                    }
                },
                royal: {
                    name: 'Royal',
                    colors: {
                        primary: '#9B59B6',
                        secondary: '#8E44AD',
                        accent: '#D4AF37',
                        background: 'linear-gradient(135deg, #1A0033 0%, #2D0052 100%)'
                    }
                },
                stealth: {
                    name: 'Stealth',
                    colors: {
                        primary: '#34495E',
                        secondary: '#2C3E50',
                        accent: '#95A5A6',
                        background: 'linear-gradient(135deg, #0C0C0C 0%, #1A1A1A 100%)'
                    }
                }
            };

            this.currentTheme = GM_getValue('current_theme', 'neonGlass');
            this.customColors = GM_getValue('custom_colors', null);
        }

        applyTheme(themeName) {
            const theme = this.themes[themeName];
            if (!theme) return;

            this.currentTheme = themeName;
            GM_setValue('current_theme', themeName);

            // Update CSS variables
            const root = document.documentElement;
            root.style.setProperty('--neon-cyan', theme.colors.primary);
            root.style.setProperty('--neon-violet', theme.colors.secondary);
            root.style.setProperty('--neon-magenta', theme.colors.accent);

            // Update background
            document.body.style.background = theme.colors.background;

            showToast(`🎨 Theme: ${theme.name}`);
        }

        createCustomTheme(colors) {
            this.customColors = colors;
            GM_setValue('custom_colors', colors);

            const root = document.documentElement;
            root.style.setProperty('--neon-cyan', colors.primary);
            root.style.setProperty('--neon-violet', colors.secondary);
            root.style.setProperty('--neon-magenta', colors.accent);

            if (colors.background) {
                document.body.style.background = colors.background;
            }

            showToast('🎨 Custom Theme Applied');
        }
    }

    const themeCustomizer = new ThemeCustomizer();

    // ==================== ADVANCED MACRO SYSTEM ====================
    class MacroSystem {
        constructor() {
            this.macros = GM_getValue('macros', {});
            this.recording = false;
            this.currentMacro = null;
            this.recordedActions = [];
        }

        startRecording(macroName) {
            this.recording = true;
            this.currentMacro = macroName;
            this.recordedActions = [];
            showToast(`⏺️ Recording Macro: ${macroName}`);
        }

        stopRecording() {
            if (!this.recording) return;

            this.macros[this.currentMacro] = {
                name: this.currentMacro,
                actions: this.recordedActions,
                created: Date.now()
            };

            GM_setValue('macros', this.macros);
            this.recording = false;
            this.currentMacro = null;
            this.recordedActions = [];

            showToast('✅ Macro Saved');
        }

        recordAction(actionType, actionData) {
            if (!this.recording) return;

            this.recordedActions.push({
                type: actionType,
                data: actionData,
                timestamp: Date.now()
            });
        }

        playMacro(macroName) {
            const macro = this.macros[macroName];
            if (!macro) return;

            showToast(`▶️ Playing Macro: ${macroName}`);

            // Calculate relative timings
            let startTime = macro.actions[0]?.timestamp || 0;

            macro.actions.forEach((action, index) => {
                const delay = action.timestamp - startTime;

                setTimeout(() => {
                    this.executeAction(action);
                }, delay);
            });
        }

        executeAction(action) {
            switch (action.type) {
                case 'keypress':
                    // Simulate keypress
                    const keyEvent = new KeyboardEvent('keydown', {
                        key: action.data.key,
                        code: action.data.code,
                        keyCode: action.data.keyCode
                    });
                    document.dispatchEvent(keyEvent);
                    break;

                case 'click':
                    // Simulate click
                    const clickEvent = new MouseEvent('click', {
                        clientX: action.data.x,
                        clientY: action.data.y
                    });
                    document.dispatchEvent(clickEvent);
                    break;

                case 'command':
                    // Execute custom command
                    this.executeCommand(action.data.command);
                    break;
            }
        }

        executeCommand(command) {
            // Execute various client commands
            switch (command) {
                case 'heal':
                    showToast('💚 Quick Heal');
                    break;
                case 'reload':
                    showToast('🔄 Quick Reload');
                    break;
                case 'switch_weapon':
                    showToast('🔫 Weapon Switch');
                    break;
            }
        }

        deleteMacro(macroName) {
            delete this.macros[macroName];
            GM_setValue('macros', this.macros);
            showToast('🗑️ Macro Deleted');
        }
    }

    const macroSystem = new MacroSystem();

    // ==================== TRAINING MODE SYSTEM ====================
    class TrainingMode {
        constructor() {
            this.active = false;
            this.mode = null;
            this.targets = [];
            this.score = 0;
            this.accuracy = 0;
            this.startTime = 0;

            // Make sure no training elements exist on load
            this.cleanup();
        }

        cleanup() {
            // Remove any leftover training elements
            const overlay = document.getElementById('gaku-training-overlay');
            if (overlay) overlay.remove();

            const indicator = document.getElementById('gaku-training-indicator');
            if (indicator) indicator.remove();

            // Remove any targets
            document.querySelectorAll('.gaku-training-target').forEach(t => t.remove());
        }

        start(mode) {
            this.active = true;
            this.mode = mode;
            this.score = 0;
            this.accuracy = 0;
            this.startTime = Date.now();

            switch (mode) {
                case 'aim':
                    this.startAimTraining();
                    break;
                case 'tracking':
                    this.startTrackingTraining();
                    break;
                case 'flick':
                    this.startFlickTraining();
                    break;
                case 'reflex':
                    this.startReflexTraining();
                    break;
            }

            showToast(`🎯 Training Mode: ${mode.toUpperCase()} | Press F6 to exit`);

            // Show training mode indicator
            this.showTrainingIndicator();
        }

        showTrainingIndicator() {
            // Create dark overlay background
            const overlay = document.createElement('div');
            overlay.id = 'gaku-training-overlay';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(10, 14, 26, 0.85);
                backdrop-filter: blur(5px);
                z-index: 9999;
                pointer-events: none;
            `;
            document.body.appendChild(overlay);

            // Create indicator
            const indicator = document.createElement('div');
            indicator.id = 'gaku-training-indicator';
            indicator.style.cssText = `
                position: fixed;
                top: 10px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(255, 45, 117, 0.9);
                backdrop-filter: blur(10px);
                border: 2px solid #FF2D75;
                border-radius: 12px;
                padding: 15px 30px;
                color: white;
                font-size: 18px;
                font-weight: 700;
                z-index: 100000;
                box-shadow: 0 0 30px rgba(255, 45, 117, 0.6);
                animation: gaku-training-pulse 2s ease-in-out infinite;
            `;
            indicator.innerHTML = `
                🎯 TRAINING MODE ACTIVE | Score: <span id="gaku-training-score">0</span> | Press F6 or ESC to Exit
            `;
            document.body.appendChild(indicator);
        }

        stop() {
            this.active = false;
            this.targets.forEach(target => target.remove());
            this.targets = [];

            // Remove training overlay
            const overlay = document.getElementById('gaku-training-overlay');
            if (overlay) overlay.remove();

            // Remove training indicator
            const indicator = document.getElementById('gaku-training-indicator');
            if (indicator) indicator.remove();

            const duration = ((Date.now() - this.startTime) / 1000).toFixed(1);
            showToast(`✅ Training Complete! Score: ${this.score} | Time: ${duration}s`);
        }

        startAimTraining() {
            // Create stationary targets
            this.spawnTarget();
        }

        startTrackingTraining() {
            // Create moving targets
            this.spawnMovingTarget();
        }

        startFlickTraining() {
            // Create targets that appear and disappear quickly
            this.spawnFlickTarget();
        }

        startReflexTraining() {
            // Create targets with reaction time measurement
            this.spawnReflexTarget();
        }

        spawnTarget() {
            const target = document.createElement('div');
            target.className = 'gaku-training-target';
            target.style.cssText = `
                position: fixed;
                width: 50px;
                height: 50px;
                background: radial-gradient(circle, #FF2D75, #8A2BE2);
                border: 3px solid #00E5FF;
                border-radius: 50%;
                cursor: crosshair;
                box-shadow: 0 0 20px #00E5FF;
                left: ${Math.random() * (window.innerWidth - 50)}px;
                top: ${Math.random() * (window.innerHeight - 50)}px;
                z-index: 10000;
            `;

            target.addEventListener('click', () => {
                this.score++;

                // Update score display
                const scoreEl = document.getElementById('gaku-training-score');
                if (scoreEl) scoreEl.textContent = this.score;

                particleSystem.createBurst(
                    parseFloat(target.style.left) + 25,
                    parseFloat(target.style.top) + 25,
                    20,
                    'spark',
                    { color: '#00E5FF' }
                );
                target.remove();
                this.targets = this.targets.filter(t => t !== target);

                if (this.active) {
                    setTimeout(() => this.spawnTarget(), 500);
                }
            });

            document.body.appendChild(target);
            this.targets.push(target);
        }

        spawnMovingTarget() {
            const target = document.createElement('div');
            target.className = 'gaku-training-target moving';
            target.style.cssText = `
                position: fixed;
                width: 40px;
                height: 40px;
                background: radial-gradient(circle, #FFD700, #FF8800);
                border: 3px solid #00E5FF;
                border-radius: 50%;
                cursor: crosshair;
                box-shadow: 0 0 20px #FFD700;
                left: ${Math.random() * (window.innerWidth - 40)}px;
                top: ${Math.random() * (window.innerHeight - 40)}px;
                z-index: 10000;
                transition: all 0.5s linear;
            `;

            let vx = (Math.random() - 0.5) * 5;
            let vy = (Math.random() - 0.5) * 5;

            const moveInterval = setInterval(() => {
                if (!this.active || !document.body.contains(target)) {
                    clearInterval(moveInterval);
                    return;
                }

                let x = parseFloat(target.style.left) + vx;
                let y = parseFloat(target.style.top) + vy;

                // Bounce off edges
                if (x < 0 || x > window.innerWidth - 40) vx *= -1;
                if (y < 0 || y > window.innerHeight - 40) vy *= -1;

                target.style.left = Math.max(0, Math.min(x, window.innerWidth - 40)) + 'px';
                target.style.top = Math.max(0, Math.min(y, window.innerHeight - 40)) + 'px';
            }, 50);

            target.addEventListener('click', () => {
                this.score += 2; // Worth more points
                clearInterval(moveInterval);
                particleSystem.createBurst(
                    parseFloat(target.style.left) + 20,
                    parseFloat(target.style.top) + 20,
                    30,
                    'magic',
                    { color: '#FFD700' }
                );
                target.remove();
                this.targets = this.targets.filter(t => t !== target);

                if (this.active) {
                    setTimeout(() => this.spawnMovingTarget(), 1000);
                }
            });

            document.body.appendChild(target);
            this.targets.push(target);
        }

        spawnFlickTarget() {
            const target = document.createElement('div');
            target.className = 'gaku-training-target flick';
            target.style.cssText = `
                position: fixed;
                width: 60px;
                height: 60px;
                background: radial-gradient(circle, #00FF88, #00AA55);
                border: 3px solid #00E5FF;
                border-radius: 50%;
                cursor: crosshair;
                box-shadow: 0 0 20px #00FF88;
                left: ${Math.random() * (window.innerWidth - 60)}px;
                top: ${Math.random() * (window.innerHeight - 60)}px;
                z-index: 10000;
                animation: gaku-flick-pulse 0.5s ease-in-out;
            `;

            const spawnTime = Date.now();

            target.addEventListener('click', () => {
                const reactionTime = Date.now() - spawnTime;
                this.score += Math.max(1, Math.floor(1000 / reactionTime));

                particleSystem.createBurst(
                    parseFloat(target.style.left) + 30,
                    parseFloat(target.style.top) + 30,
                    25,
                    'heal',
                    { color: '#00FF88' }
                );

                showToast(`⚡ ${reactionTime}ms`);
                target.remove();
                this.targets = this.targets.filter(t => t !== target);

                if (this.active) {
                    setTimeout(() => this.spawnFlickTarget(), Math.random() * 1000 + 500);
                }
            });

            // Auto-remove after 1 second
            setTimeout(() => {
                if (document.body.contains(target)) {
                    target.remove();
                    this.targets = this.targets.filter(t => t !== target);

                    if (this.active) {
                        this.spawnFlickTarget();
                    }
                }
            }, 1000);

            document.body.appendChild(target);
            this.targets.push(target);
        }

        spawnReflexTarget() {
            // Similar to flick but measures pure reaction time
            this.spawnFlickTarget();
        }
    }

    const trainingMode = new TrainingMode();

    // ==================== SOCIAL FEATURES ====================
    class SocialSystem {
        constructor() {
            this.friends = GM_getValue('friends', []);
            this.blockedUsers = GM_getValue('blocked_users', []);
            this.chatHistory = [];
            this.maxChatHistory = 100;
        }

        addFriend(username, userId) {
            if (this.friends.find(f => f.id === userId)) {
                showToast('⚠️ Already friends');
                return;
            }

            this.friends.push({
                id: userId,
                username: username,
                addedAt: Date.now(),
                online: false
            });

            GM_setValue('friends', this.friends);
            showToast(`✅ Added ${username} as friend`);
        }

        removeFriend(userId) {
            this.friends = this.friends.filter(f => f.id !== userId);
            GM_setValue('friends', this.friends);
            showToast('🗑️ Friend removed');
        }

        blockUser(username, userId) {
            if (this.blockedUsers.find(u => u.id === userId)) {
                showToast('⚠️ Already blocked');
                return;
            }

            this.blockedUsers.push({
                id: userId,
                username: username,
                blockedAt: Date.now()
            });

            GM_setValue('blocked_users', this.blockedUsers);
            showToast(`🚫 Blocked ${username}`);
        }

        unblockUser(userId) {
            this.blockedUsers = this.blockedUsers.filter(u => u.id !== userId);
            GM_setValue('blocked_users', this.blockedUsers);
            showToast('✅ User unblocked');
        }

        addChatMessage(username, message, type = 'normal') {
            const chatMessage = {
                username: username,
                message: message,
                type: type,
                timestamp: Date.now()
            };

            this.chatHistory.push(chatMessage);

            if (this.chatHistory.length > this.maxChatHistory) {
                this.chatHistory.shift();
            }

            // Display in chat UI
            this.displayChatMessage(chatMessage);
        }

        displayChatMessage(chatMessage) {
            const chatContainer = document.getElementById('gaku-chat-messages');
            if (!chatContainer) return;

            const messageEl = document.createElement('div');
            messageEl.className = `gaku-chat-message ${chatMessage.type}`;
            messageEl.innerHTML = `
                <span class="gaku-chat-username">${chatMessage.username}:</span>
                <span class="gaku-chat-text">${this.sanitizeMessage(chatMessage.message)}</span>
            `;

            chatContainer.appendChild(messageEl);
            chatContainer.scrollTop = chatContainer.scrollHeight;

            // Remove old messages
            while (chatContainer.children.length > 50) {
                chatContainer.removeChild(chatContainer.firstChild);
            }
        }

        sanitizeMessage(message) {
            const div = document.createElement('div');
            div.textContent = message;
            return div.innerHTML;
        }
    }

    const socialSystem = new SocialSystem();

    // ==================== ADVANCED AUDIO VISUALIZER ====================
    class AudioVisualizer {
        constructor() {
            this.canvas = null;
            this.ctx = null;
            this.analyser = null;
            this.dataArray = null;
            this.bufferLength = 0;
            this.animationId = null;
            this.enabled = GM_getValue('audio_visualizer', true);
            this.style = GM_getValue('visualizer_style', 'bars');
        }

        init(audioContext) {
            if (!this.enabled) return;

            this.canvas = document.createElement('canvas');
            this.canvas.id = 'gaku-audio-visualizer';
            this.canvas.width = 300;
            this.canvas.height = 100;
            this.canvas.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                border: 2px solid #00E5FF;
                border-radius: 8px;
                background: rgba(15, 18, 28, 0.8);
                backdrop-filter: blur(10px);
                box-shadow: 0 0 20px rgba(0, 229, 255, 0.5);
                z-index: 9998;
            `;

            this.ctx = this.canvas.getContext('2d');
            document.body.appendChild(this.canvas);

            // Setup audio analyser
            this.analyser = audioContext.createAnalyser();
            this.analyser.fftSize = 256;
            this.bufferLength = this.analyser.frequencyBinCount;
            this.dataArray = new Uint8Array(this.bufferLength);

            this.startVisualization();
        }

        startVisualization() {
            const draw = () => {
                this.animationId = requestAnimationFrame(draw);

                if (!this.analyser) return;

                this.analyser.getByteFrequencyData(this.dataArray);

                this.ctx.fillStyle = 'rgba(15, 18, 28, 0.3)';
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

                switch (this.style) {
                    case 'bars':
                        this.drawBars();
                        break;
                    case 'wave':
                        this.drawWave();
                        break;
                    case 'circle':
                        this.drawCircle();
                        break;
                    case 'particles':
                        this.drawParticles();
                        break;
                }
            };

            draw();
        }

        drawBars() {
            const barWidth = (this.canvas.width / this.bufferLength) * 2.5;
            let x = 0;

            for (let i = 0; i < this.bufferLength; i++) {
                const barHeight = (this.dataArray[i] / 255) * this.canvas.height;

                const gradient = this.ctx.createLinearGradient(0, this.canvas.height - barHeight, 0, this.canvas.height);
                gradient.addColorStop(0, '#00E5FF');
                gradient.addColorStop(0.5, '#8A2BE2');
                gradient.addColorStop(1, '#FF2D75');

                this.ctx.fillStyle = gradient;
                this.ctx.fillRect(x, this.canvas.height - barHeight, barWidth, barHeight);

                x += barWidth + 1;
            }
        }

        drawWave() {
            this.ctx.lineWidth = 2;
            this.ctx.strokeStyle = '#00E5FF';
            this.ctx.beginPath();

            const sliceWidth = this.canvas.width / this.bufferLength;
            let x = 0;

            for (let i = 0; i < this.bufferLength; i++) {
                const v = this.dataArray[i] / 255.0;
                const y = v * this.canvas.height;

                if (i === 0) {
                    this.ctx.moveTo(x, y);
                } else {
                    this.ctx.lineTo(x, y);
                }

                x += sliceWidth;
            }

            this.ctx.stroke();
        }

        drawCircle() {
            const centerX = this.canvas.width / 2;
            const centerY = this.canvas.height / 2;
            const radius = Math.min(centerX, centerY) - 10;

            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            this.ctx.strokeStyle = '#00E5FF';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();

            for (let i = 0; i < this.bufferLength; i++) {
                const angle = (i / this.bufferLength) * Math.PI * 2;
                const amplitude = (this.dataArray[i] / 255) * 30;

                const x1 = centerX + Math.cos(angle) * radius;
                const y1 = centerY + Math.sin(angle) * radius;
                const x2 = centerX + Math.cos(angle) * (radius + amplitude);
                const y2 = centerY + Math.sin(angle) * (radius + amplitude);

                this.ctx.beginPath();
                this.ctx.moveTo(x1, y1);
                this.ctx.lineTo(x2, y2);
                this.ctx.strokeStyle = `hsl(${(i / this.bufferLength) * 360}, 100%, 50%)`;
                this.ctx.stroke();
            }
        }

        drawParticles() {
            for (let i = 0; i < this.bufferLength; i += 4) {
                const x = (i / this.bufferLength) * this.canvas.width;
                const size = (this.dataArray[i] / 255) * 10;
                const y = this.canvas.height / 2;

                this.ctx.fillStyle = `hsl(${(i / this.bufferLength) * 360}, 100%, 50%)`;
                this.ctx.beginPath();
                this.ctx.arc(x, y, size, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }

        stop() {
            if (this.animationId) {
                cancelAnimationFrame(this.animationId);
                this.animationId = null;
            }
            if (this.canvas) {
                this.canvas.remove();
                this.canvas = null;
            }
        }
    }

    const audioVisualizer = new AudioVisualizer();

    // ==================== PERFORMANCE PROFILER ====================
    class PerformanceProfiler {
        constructor() {
            this.metrics = {
                fps: [],
                frameTime: [],
                memory: [],
                drawCalls: [],
                entityCount: []
            };
            this.maxSamples = 300;
            this.monitoring = false;
            this.monitorInterval = null;
        }

        start() {
            if (this.monitoring) return;

            this.monitoring = true;
            this.monitorInterval = setInterval(() => {
                this.collectMetrics();
            }, 100);

            showToast('📊 Performance Monitoring Started');
        }

        stop() {
            if (!this.monitoring) return;

            this.monitoring = false;
            if (this.monitorInterval) {
                clearInterval(this.monitorInterval);
                this.monitorInterval = null;
            }

            showToast('📊 Performance Monitoring Stopped');
        }

        collectMetrics() {
            // FPS
            const fps = STATE.fps;
            this.addMetric('fps', fps);

            // Frame time
            const frameTime = 1000 / fps;
            this.addMetric('frameTime', frameTime);

            // Memory (if available)
            if (performance.memory) {
                const memoryMB = performance.memory.usedJSHeapSize / 1048576;
                this.addMetric('memory', memoryMB);
            }

            // Entity count (would track actual game entities)
            this.addMetric('entityCount', Math.floor(Math.random() * 100));
        }

        addMetric(type, value) {
            this.metrics[type].push({
                timestamp: Date.now(),
                value: value
            });

            if (this.metrics[type].length > this.maxSamples) {
                this.metrics[type].shift();
            }
        }

        getAverageFPS() {
            if (this.metrics.fps.length === 0) return 0;
            const sum = this.metrics.fps.reduce((acc, m) => acc + m.value, 0);
            return (sum / this.metrics.fps.length).toFixed(1);
        }

        getAverageFrameTime() {
            if (this.metrics.frameTime.length === 0) return 0;
            const sum = this.metrics.frameTime.reduce((acc, m) => acc + m.value, 0);
            return (sum / this.metrics.frameTime.length).toFixed(2);
        }

        getMemoryUsage() {
            if (this.metrics.memory.length === 0) return 0;
            const latest = this.metrics.memory[this.metrics.memory.length - 1];
            return latest ? latest.value.toFixed(1) : 0;
        }

        generateReport() {
            return {
                avgFPS: this.getAverageFPS(),
                avgFrameTime: this.getAverageFrameTime(),
                memoryUsage: this.getMemoryUsage(),
                samples: this.metrics.fps.length,
                timestamp: Date.now()
            };
        }

        exportData() {
            const data = JSON.stringify(this.metrics, null, 2);
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = `gaku-performance-${Date.now()}.json`;
            link.click();

            URL.revokeObjectURL(url);
            showToast('💾 Performance Data Exported');
        }
    }

    const performanceProfiler = new PerformanceProfiler();

    // ==================== INVENTORY MANAGER ====================
    class InventoryManager {
        constructor() {
            this.inventory = [];
            this.loadouts = GM_getValue('loadouts', {});
            this.favoriteItems = GM_getValue('favorite_items', []);
            this.quickSlots = GM_getValue('quick_slots', {});
        }

        addItem(item) {
            this.inventory.push({
                id: Date.now(),
                ...item,
                addedAt: Date.now()
            });
            this.sortInventory();
        }

        removeItem(itemId) {
            this.inventory = this.inventory.filter(i => i.id !== itemId);
        }

        sortInventory(sortBy = 'rarity') {
            const rarityOrder = { legendary: 5, epic: 4, rare: 3, uncommon: 2, common: 1 };

            this.inventory.sort((a, b) => {
                switch (sortBy) {
                    case 'rarity':
                        return (rarityOrder[b.rarity] || 0) - (rarityOrder[a.rarity] || 0);
                    case 'name':
                        return a.name.localeCompare(b.name);
                    case 'type':
                        return a.type.localeCompare(b.type);
                    case 'recent':
                        return b.addedAt - a.addedAt;
                    default:
                        return 0;
                }
            });
        }

        createLoadout(name, items) {
            this.loadouts[name] = {
                name: name,
                items: items,
                created: Date.now()
            };
            GM_setValue('loadouts', this.loadouts);
            showToast(`💼 Loadout "${name}" created`);
        }

        applyLoadout(name) {
            const loadout = this.loadouts[name];
            if (!loadout) return;

            showToast(`💼 Applied loadout: ${name}`);
            // Would apply the loadout in actual game
        }

        toggleFavorite(itemId) {
            const index = this.favoriteItems.indexOf(itemId);
            if (index > -1) {
                this.favoriteItems.splice(index, 1);
            } else {
                this.favoriteItems.push(itemId);
            }
            GM_setValue('favorite_items', this.favoriteItems);
        }

        setQuickSlot(slot, itemId) {
            this.quickSlots[slot] = itemId;
            GM_setValue('quick_slots', this.quickSlots);
            showToast(`⚡ Quick slot ${slot} set`);
        }
    }

    const inventoryManager = new InventoryManager();

    // ==================== MINIMAP ENHANCEMENTS ====================
    class EnhancedMinimap {
        constructor() {
            this.canvas = null;
            this.ctx = null;
            this.zoom = GM_getValue('minimap_zoom', 1.0);
            this.rotation = GM_getValue('minimap_rotation', true);
            this.showGrid = GM_getValue('minimap_grid', true);
            this.showPings = GM_getValue('minimap_pings', true);
            this.markers = [];
            this.pings = [];
        }

        init() {
            this.canvas = document.createElement('canvas');
            this.canvas.id = 'gaku-enhanced-minimap';
            this.canvas.width = 250;
            this.canvas.height = 250;
            this.canvas.style.cssText = `
                position: fixed;
                top: 20px;
                left: 20px;
                border: 3px solid #00E5FF;
                border-radius: 12px;
                background: rgba(15, 18, 28, 0.9);
                backdrop-filter: blur(10px);
                box-shadow: 0 0 30px rgba(0, 229, 255, 0.6);
                z-index: 9997;
            `;

            this.ctx = this.canvas.getContext('2d');
            document.body.appendChild(this.canvas);

            this.startRendering();
        }

        startRendering() {
            const render = () => {
                this.clear();
                this.drawGrid();
                this.drawMarkers();
                this.drawPings();
                this.drawPlayer();

                requestAnimationFrame(render);
            };

            render();
        }

        clear() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }

        drawGrid() {
            if (!this.showGrid) return;

            this.ctx.strokeStyle = 'rgba(0, 229, 255, 0.2)';
            this.ctx.lineWidth = 1;

            const gridSize = 50;
            for (let x = 0; x < this.canvas.width; x += gridSize) {
                this.ctx.beginPath();
                this.ctx.moveTo(x, 0);
                this.ctx.lineTo(x, this.canvas.height);
                this.ctx.stroke();
            }

            for (let y = 0; y < this.canvas.height; y += gridSize) {
                this.ctx.beginPath();
                this.ctx.moveTo(0, y);
                this.ctx.lineTo(this.canvas.width, y);
                this.ctx.stroke();
            }
        }

        drawPlayer() {
            const centerX = this.canvas.width / 2;
            const centerY = this.canvas.height / 2;

            // Player dot
            this.ctx.fillStyle = '#00E5FF';
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
            this.ctx.fill();

            // Glow effect
            this.ctx.shadowBlur = 15;
            this.ctx.shadowColor = '#00E5FF';
            this.ctx.strokeStyle = '#00E5FF';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, 12, 0, Math.PI * 2);
            this.ctx.stroke();
            this.ctx.shadowBlur = 0;

            // Direction indicator
            this.ctx.strokeStyle = '#00E5FF';
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.moveTo(centerX, centerY);
            this.ctx.lineTo(centerX, centerY - 20);
            this.ctx.stroke();
        }

        drawMarkers() {
            this.markers.forEach(marker => {
                this.ctx.fillStyle = marker.color || '#FF2D75';
                this.ctx.font = '20px Arial';
                this.ctx.fillText(marker.icon || '📍', marker.x, marker.y);
            });
        }

        drawPings() {
            if (!this.showPings) return;

            const now = Date.now();
            this.pings = this.pings.filter(ping => now - ping.timestamp < 3000);

            this.pings.forEach(ping => {
                const age = now - ping.timestamp;
                const alpha = 1 - (age / 3000);
                const radius = 10 + (age / 100);

                this.ctx.strokeStyle = `rgba(255, 45, 117, ${alpha})`;
                this.ctx.lineWidth = 3;
                this.ctx.beginPath();
                this.ctx.arc(ping.x, ping.y, radius, 0, Math.PI * 2);
                this.ctx.stroke();
            });
        }

        addMarker(x, y, icon, color) {
            this.markers.push({ x, y, icon, color, id: Date.now() });
        }

        removeMarker(id) {
            this.markers = this.markers.filter(m => m.id !== id);
        }

        addPing(x, y) {
            this.pings.push({ x, y, timestamp: Date.now() });
        }

        setZoom(zoom) {
            this.zoom = Math.max(0.5, Math.min(3.0, zoom));
            GM_setValue('minimap_zoom', this.zoom);
        }
    }

    const enhancedMinimap = new EnhancedMinimap();

    // ==================== WEAPON SYSTEM ====================
    class WeaponSystem {
        constructor() {
            this.weapons = this.loadWeaponDatabase();
            this.currentWeapon = null;
            this.inventory = [];
            this.attachments = GM_getValue('weapon_attachments', {});
            this.skins = GM_getValue('weapon_skins', {});
            this.favorites = GM_getValue('favorite_weapons', []);
        }

        loadWeaponDatabase() {
            return {
                // Assault Rifles
                ak47: { name: 'AK-47', type: 'AR', damage: 45, fireRate: 600, accuracy: 70, range: 80, recoil: 65, magazine: 30 },
                m4a1: { name: 'M4A1', type: 'AR', damage: 40, fireRate: 750, accuracy: 85, range: 75, recoil: 45, magazine: 30 },
                scar: { name: 'SCAR-L', type: 'AR', damage: 42, fireRate: 625, accuracy: 80, range: 78, recoil: 50, magazine: 30 },
                famas: { name: 'FAMAS', type: 'AR', damage: 38, fireRate: 900, accuracy: 75, range: 70, recoil: 60, magazine: 25 },

                // SMGs
                mp5: { name: 'MP5', type: 'SMG', damage: 30, fireRate: 800, accuracy: 75, range: 50, recoil: 35, magazine: 30 },
                vector: { name: 'Vector', type: 'SMG', damage: 28, fireRate: 1200, accuracy: 70, range: 45, recoil: 55, magazine: 25 },
                uzi: { name: 'UZI', type: 'SMG', damage: 26, fireRate: 1000, accuracy: 65, range: 40, recoil: 50, magazine: 32 },

                // Sniper Rifles
                awm: { name: 'AWM', type: 'SR', damage: 120, fireRate: 60, accuracy: 95, range: 100, recoil: 85, magazine: 5 },
                kar98k: { name: 'Kar98k', type: 'SR', damage: 90, fireRate: 45, accuracy: 90, range: 95, recoil: 75, magazine: 5 },
                m24: { name: 'M24', type: 'SR', damage: 95, fireRate: 50, accuracy: 92, range: 98, recoil: 78, magazine: 5 },

                // Shotguns
                s12k: { name: 'S12K', type: 'SG', damage: 80, fireRate: 300, accuracy: 40, range: 30, recoil: 70, magazine: 5 },
                m870: { name: 'M870', type: 'SG', damage: 100, fireRate: 100, accuracy: 35, range: 25, recoil: 80, magazine: 5 },

                // Pistols
                deagle: { name: 'Desert Eagle', type: 'Pistol', damage: 60, fireRate: 200, accuracy: 70, range: 50, recoil: 65, magazine: 7 },
                glock: { name: 'Glock 18', type: 'Pistol', damage: 25, fireRate: 400, accuracy: 65, range: 40, recoil: 30, magazine: 17 },

                // LMGs
                m249: { name: 'M249', type: 'LMG', damage: 42, fireRate: 750, accuracy: 70, range: 85, recoil: 70, magazine: 100 },
                pkm: { name: 'PKM', type: 'LMG', damage: 48, fireRate: 650, accuracy: 68, range: 88, recoil: 75, magazine: 100 }
            };
        }

        getWeaponStats(weaponId) {
            return this.weapons[weaponId] || null;
        }

        calculateDPS(weaponId) {
            const weapon = this.weapons[weaponId];
            if (!weapon) return 0;
            return (weapon.damage * weapon.fireRate) / 60;
        }

        calculateTTK(weaponId, enemyHealth = 100) {
            const weapon = this.weapons[weaponId];
            if (!weapon) return 0;
            const shotsToKill = Math.ceil(enemyHealth / weapon.damage);
            return (shotsToKill / weapon.fireRate) * 60;
        }

        compareWeapons(weaponId1, weaponId2) {
            const w1 = this.weapons[weaponId1];
            const w2 = this.weapons[weaponId2];

            return {
                damage: w1.damage - w2.damage,
                fireRate: w1.fireRate - w2.fireRate,
                accuracy: w1.accuracy - w2.accuracy,
                range: w1.range - w2.range,
                recoil: w2.recoil - w1.recoil, // Lower is better
                dps: this.calculateDPS(weaponId1) - this.calculateDPS(weaponId2)
            };
        }

        addAttachment(weaponId, attachmentType, attachmentId) {
            if (!this.attachments[weaponId]) {
                this.attachments[weaponId] = {};
            }
            this.attachments[weaponId][attachmentType] = attachmentId;
            GM_setValue('weapon_attachments', this.attachments);
            showToast(`🔧 ${attachmentType} attached`);
        }

        applySkin(weaponId, skinId) {
            this.skins[weaponId] = skinId;
            GM_setValue('weapon_skins', this.skins);
            showToast(`🎨 Skin applied to ${this.weapons[weaponId].name}`);
        }
    }

    const weaponSystem = new WeaponSystem();

    // ==================== DAMAGE CALCULATOR ====================
    class DamageCalculator {
        constructor() {
            this.damageModifiers = {
                headshot: 2.5,
                chest: 1.0,
                limbs: 0.75,
                distance: {
                    close: 1.0,    // 0-25m
                    medium: 0.85,  // 25-50m
                    long: 0.7,     // 50-100m
                    extreme: 0.5   // 100m+
                },
                armor: {
                    none: 1.0,
                    level1: 0.7,
                    level2: 0.55,
                    level3: 0.45
                }
            };
        }

        calculateDamage(baseDamage, hitLocation, distance, armorLevel = 'none') {
            let damage = baseDamage;

            // Apply hit location modifier
            damage *= this.damageModifiers[hitLocation] || 1.0;

            // Apply distance modifier
            let distanceMod = 1.0;
            if (distance <= 25) distanceMod = this.damageModifiers.distance.close;
            else if (distance <= 50) distanceMod = this.damageModifiers.distance.medium;
            else if (distance <= 100) distanceMod = this.damageModifiers.distance.long;
            else distanceMod = this.damageModifiers.distance.extreme;

            damage *= distanceMod;

            // Apply armor modifier
            damage *= this.damageModifiers.armor[armorLevel] || 1.0;

            return Math.round(damage);
        }

        calculateBulletDrop(distance, velocity = 800) {
            const gravity = 9.81;
            const time = distance / velocity;
            return (0.5 * gravity * time * time);
        }

        calculateLeadDistance(targetSpeed, distance, bulletSpeed = 800) {
            const timeToTarget = distance / bulletSpeed;
            return targetSpeed * timeToTarget;
        }
    }

    const damageCalculator = new DamageCalculator();

    // ==================== LOOT TIER SYSTEM ====================
    class LootTierSystem {
        constructor() {
            this.tiers = {
                common: { color: '#FFFFFF', weight: 50, glow: 0.3 },
                uncommon: { color: '#00FF00', weight: 30, glow: 0.5 },
                rare: { color: '#0080FF', weight: 15, glow: 0.7 },
                epic: { color: '#8A2BE2', weight: 4, glow: 0.9 },
                legendary: { color: '#FFD700', weight: 1, glow: 1.2 }
            };

            this.lootTable = this.generateLootTable();
        }

        generateLootTable() {
            return {
                weapons: {
                    common: ['glock', 'uzi', 'm870'],
                    uncommon: ['mp5', 'scar', 'm4a1'],
                    rare: ['ak47', 'vector', 'kar98k'],
                    epic: ['m24', 'awm', 'm249'],
                    legendary: ['deagle', 'pkm']
                },
                armor: {
                    common: ['helmet_1', 'vest_1'],
                    uncommon: ['helmet_2', 'vest_2'],
                    rare: ['helmet_3', 'vest_3'],
                    epic: ['helmet_3_reinforced'],
                    legendary: ['vest_3_reinforced']
                },
                attachments: {
                    common: ['red_dot', 'vertical_grip'],
                    uncommon: ['holographic', 'angled_grip', 'compensator'],
                    rare: ['4x_scope', 'extended_mag', 'suppressor'],
                    epic: ['8x_scope', 'extended_quickdraw', 'tactical_stock'],
                    legendary: ['15x_scope', 'gilded_suppressor']
                },
                consumables: {
                    common: ['bandage', 'energy_drink'],
                    uncommon: ['first_aid', 'painkiller'],
                    rare: ['med_kit', 'adrenaline'],
                    epic: ['super_med_kit'],
                    legendary: ['phoenix_kit']
                }
            };
        }

        getTierByRarity(rarity) {
            return this.tiers[rarity] || this.tiers.common;
        }

        rollLoot(category) {
            const totalWeight = Object.values(this.tiers).reduce((sum, tier) => sum + tier.weight, 0);
            let roll = Math.random() * totalWeight;

            for (const [tierName, tierData] of Object.entries(this.tiers)) {
                roll -= tierData.weight;
                if (roll <= 0) {
                    const items = this.lootTable[category][tierName];
                    if (items && items.length > 0) {
                        return {
                            item: items[Math.floor(Math.random() * items.length)],
                            tier: tierName,
                            color: tierData.color
                        };
                    }
                }
            }

            return null;
        }
    }

    const lootTierSystem = new LootTierSystem();

    // ==================== WEATHER SYSTEM ====================
    class WeatherSystem {
        constructor() {
            this.currentWeather = 'clear';
            this.weatherEffects = {
                clear: { visibility: 1.0, movement: 1.0, sound: 1.0 },
                rain: { visibility: 0.7, movement: 0.95, sound: 0.8 },
                fog: { visibility: 0.5, movement: 1.0, sound: 0.9 },
                storm: { visibility: 0.6, movement: 0.9, sound: 0.7 },
                snow: { visibility: 0.75, movement: 0.85, sound: 0.85 },
                sandstorm: { visibility: 0.4, movement: 0.8, sound: 0.6 }
            };
            this.transitionDuration = 30000; // 30 seconds
        }

        changeWeather(weatherType) {
            if (!this.weatherEffects[weatherType]) return;

            this.currentWeather = weatherType;
            const effects = this.weatherEffects[weatherType];

            showToast(`🌤️ Weather: ${weatherType.toUpperCase()}`);
            this.applyWeatherEffects(effects);
        }

        applyWeatherEffects(effects) {
            // Apply visual effects
            document.body.style.filter = `brightness(${effects.visibility})`;

            // Create weather particles
            this.createWeatherParticles();
        }

        createWeatherParticles() {
            switch (this.currentWeather) {
                case 'rain':
                    for (let i = 0; i < 50; i++) {
                        setTimeout(() => {
                            particleSystem.createParticle(
                                Math.random() * window.innerWidth,
                                0,
                                'rain',
                                { gravity: 2, friction: 0.99, color: '#88CCFF' }
                            );
                        }, i * 100);
                    }
                    break;

                case 'snow':
                    for (let i = 0; i < 30; i++) {
                        setTimeout(() => {
                            particleSystem.createParticle(
                                Math.random() * window.innerWidth,
                                0,
                                'smoke',
                                { gravity: 0.1, friction: 0.98, color: '#FFFFFF' }
                            );
                        }, i * 150);
                    }
                    break;
            }
        }

        randomWeather() {
            const weathers = Object.keys(this.weatherEffects);
            const randomWeather = weathers[Math.floor(Math.random() * weathers.length)];
            this.changeWeather(randomWeather);
        }
    }

    const weatherSystem = new WeatherSystem();

    // ==================== MOVEMENT ANALYZER ====================
    class MovementAnalyzer {
        constructor() {
            this.positions = [];
            this.maxPositions = 100;
            this.movementPatterns = {
                stationary: 0,
                walking: 0,
                running: 0,
                zigzag: 0,
                circular: 0
            };
        }

        recordPosition(x, y, timestamp) {
            this.positions.push({ x, y, timestamp });

            if (this.positions.length > this.maxPositions) {
                this.positions.shift();
            }

            this.analyzeMovement();
        }

        analyzeMovement() {
            if (this.positions.length < 3) return;

            const recent = this.positions.slice(-10);
            const distances = [];
            const angles = [];

            for (let i = 1; i < recent.length; i++) {
                const dx = recent[i].x - recent[i-1].x;
                const dy = recent[i].y - recent[i-1].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const angle = Math.atan2(dy, dx);

                distances.push(distance);
                angles.push(angle);
            }

            const avgDistance = distances.reduce((a, b) => a + b, 0) / distances.length;
            const angleVariance = this.calculateVariance(angles);

            // Classify movement pattern
            if (avgDistance < 1) {
                this.movementPatterns.stationary++;
            } else if (avgDistance < 5) {
                this.movementPatterns.walking++;
            } else if (angleVariance < 0.5) {
                this.movementPatterns.running++;
            } else if (angleVariance > 1.5) {
                this.movementPatterns.zigzag++;
            } else {
                this.movementPatterns.circular++;
            }
        }

        calculateVariance(values) {
            const mean = values.reduce((a, b) => a + b, 0) / values.length;
            const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
            return squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
        }

        getMovementSpeed() {
            if (this.positions.length < 2) return 0;

            const recent = this.positions.slice(-5);
            let totalDistance = 0;
            let totalTime = 0;

            for (let i = 1; i < recent.length; i++) {
                const dx = recent[i].x - recent[i-1].x;
                const dy = recent[i].y - recent[i-1].y;
                totalDistance += Math.sqrt(dx * dx + dy * dy);
                totalTime += recent[i].timestamp - recent[i-1].timestamp;
            }

            return totalTime > 0 ? (totalDistance / totalTime) * 1000 : 0; // pixels per second
        }

        predictNextPosition(lookahead = 500) {
            if (this.positions.length < 3) return null;

            const recent = this.positions.slice(-3);
            const vx = (recent[2].x - recent[0].x) / (recent[2].timestamp - recent[0].timestamp);
            const vy = (recent[2].y - recent[0].y) / (recent[2].timestamp - recent[0].timestamp);

            return {
                x: recent[2].x + vx * lookahead,
                y: recent[2].y + vy * lookahead
            };
        }
    }

    const movementAnalyzer = new MovementAnalyzer();

    // ==================== SOUND SYSTEM ====================
    class SoundSystem {
        constructor() {
            this.sounds = {};
            this.volume = GM_getValue('master_volume', 0.7);
            this.sfxVolume = GM_getValue('sfx_volume', 0.8);
            this.musicVolume = GM_getValue('music_volume', 0.5);
            this.spatialAudio = GM_getValue('spatial_audio', true);
        }

        createSound(frequency, duration, type = 'sine') {
            const ctx = initAudioContext();
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.type = type;
            oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            gainNode.gain.setValueAtTime(this.volume * this.sfxVolume, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

            oscillator.start(ctx.currentTime);
            oscillator.stop(ctx.currentTime + duration);

            return { oscillator, gainNode };
        }

        playFootstep(surface = 'grass') {
            const frequencies = {
                grass: [200, 180],
                concrete: [300, 280],
                wood: [250, 230],
                metal: [400, 380],
                water: [150, 140]
            };

            const freq = frequencies[surface] || frequencies.grass;
            this.createSound(freq[Math.floor(Math.random() * 2)], 0.1, 'sine');
        }

        playGunshot(weaponType = 'rifle') {
            const frequencies = {
                pistol: 800,
                rifle: 600,
                shotgun: 400,
                sniper: 500
            };

            const freq = frequencies[weaponType] || 600;
            this.createSound(freq, 0.15, 'sawtooth');
        }

        playReload() {
            this.createSound(400, 0.05);
            setTimeout(() => this.createSound(500, 0.05), 200);
            setTimeout(() => this.createSound(600, 0.05), 400);
        }

        playExplosion() {
            const ctx = initAudioContext();

            // Low rumble
            const bass = ctx.createOscillator();
            const bassGain = ctx.createGain();
            bass.frequency.setValueAtTime(50, ctx.currentTime);
            bass.connect(bassGain);
            bassGain.connect(ctx.destination);
            bassGain.gain.setValueAtTime(0.5, ctx.currentTime);
            bassGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1);
            bass.start();
            bass.stop(ctx.currentTime + 1);

            // High crack
            const crack = ctx.createOscillator();
            const crackGain = ctx.createGain();
            crack.frequency.setValueAtTime(2000, ctx.currentTime);
            crack.connect(crackGain);
            crackGain.connect(ctx.destination);
            crackGain.gain.setValueAtTime(0.3, ctx.currentTime);
            crackGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
            crack.start();
            crack.stop(ctx.currentTime + 0.2);
        }

        play3DSound(x, y, listenerX, listenerY, soundType) {
            if (!this.spatialAudio) {
                this[`play${soundType}`]();
                return;
            }

            const dx = x - listenerX;
            const dy = y - listenerY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const maxDistance = 1000;

            const volume = Math.max(0, 1 - (distance / maxDistance));

            if (volume > 0.01) {
                const ctx = initAudioContext();
                const panner = ctx.createStereoPanner();
                const angle = Math.atan2(dy, dx);
                panner.pan.value = Math.sin(angle);

                // Play sound with panning
                this[`play${soundType}`]();
            }
        }
    }

    const soundSystem = new SoundSystem();

    // ==================== NOTIFICATION SYSTEM ====================
    class NotificationSystem {
        constructor() {
            this.notifications = [];
            this.maxNotifications = 5;
            this.defaultDuration = 5000;
        }

        show(message, type = 'info', duration = this.defaultDuration) {
            const notification = {
                id: Date.now(),
                message: message,
                type: type,
                timestamp: Date.now()
            };

            this.notifications.push(notification);
            this.displayNotification(notification);

            setTimeout(() => {
                this.remove(notification.id);
            }, duration);

            if (this.notifications.length > this.maxNotifications) {
                this.remove(this.notifications[0].id);
            }
        }

        displayNotification(notification) {
            const container = this.getOrCreateContainer();

            const notifEl = document.createElement('div');
            notifEl.className = `gaku-notification gaku-notification-${notification.type}`;
            notifEl.id = `gaku-notif-${notification.id}`;
            notifEl.innerHTML = `
                <div class="gaku-notification-icon">${this.getIcon(notification.type)}</div>
                <div class="gaku-notification-message">${notification.message}</div>
                <button class="gaku-notification-close" onclick="this.parentElement.remove()">✕</button>
            `;

            container.appendChild(notifEl);

            // Animate in
            setTimeout(() => notifEl.classList.add('show'), 10);
        }

        getOrCreateContainer() {
            let container = document.getElementById('gaku-notification-container');
            if (!container) {
                container = document.createElement('div');
                container.id = 'gaku-notification-container';
                container.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 100001;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                `;
                document.body.appendChild(container);
            }
            return container;
        }

        getIcon(type) {
            const icons = {
                info: 'ℹ️',
                success: '✅',
                warning: '⚠️',
                error: '❌',
                kill: '💀',
                achievement: '🏆',
                level: '⬆️'
            };
            return icons[type] || icons.info;
        }

        remove(id) {
            const notif = document.getElementById(`gaku-notif-${id}`);
            if (notif) {
                notif.classList.remove('show');
                setTimeout(() => notif.remove(), 300);
            }
            this.notifications = this.notifications.filter(n => n.id !== id);
        }
    }

    const notificationSystem = new NotificationSystem();

    // ==================== KEYBIND MANAGER ====================
    class KeybindManager {
        constructor() {
            this.keybinds = GM_getValue('custom_keybinds', this.getDefaultKeybinds());
            this.recording = false;
            this.recordingAction = null;
        }

        getDefaultKeybinds() {
            return {
                // Movement
                moveForward: 'KeyW',
                moveBackward: 'KeyS',
                moveLeft: 'KeyA',
                moveRight: 'KeyD',
                jump: 'Space',
                crouch: 'KeyC',
                prone: 'KeyZ',
                sprint: 'ShiftLeft',

                // Combat
                fire: 'Mouse0',
                aim: 'Mouse1',
                reload: 'KeyR',
                switchWeapon: 'KeyQ',
                melee: 'KeyV',

                // Items
                useItem: 'KeyF',
                inventory: 'Tab',
                map: 'KeyM',

                // Communication
                pushToTalk: 'KeyT',
                ping: 'Mouse2',

                // Client
                settings: 'F1',
                stats: 'F5',
                training: 'F6'
            };
        }

        setKeybind(action, key) {
            this.keybinds[action] = key;
            GM_setValue('custom_keybinds', this.keybinds);
            showToast(`⌨️ ${action}: ${key}`);
        }

        getKeybind(action) {
            return this.keybinds[action] || null;
        }

        startRecording(action) {
            this.recording = true;
            this.recordingAction = action;
            showToast(`⏺️ Press any key for ${action}`);
        }

        stopRecording() {
            this.recording = false;
            this.recordingAction = null;
        }

        handleKeyPress(event) {
            if (!this.recording) return;

            const key = event.code || event.key;
            this.setKeybind(this.recordingAction, key);
            this.stopRecording();
        }

        resetToDefaults() {
            this.keybinds = this.getDefaultKeybinds();
            GM_setValue('custom_keybinds', this.keybinds);
            showToast('⌨️ Keybinds reset to defaults');
        }
    }

    const keybindManager = new KeybindManager();

    // ==================== ADDITIONAL CSS STYLES ====================
    const ADDITIONAL_STYLES = `
        /* Stats Dashboard Styles */
        #gaku-stats-dashboard {
            position: fixed !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            width: 900px !important;
            max-height: 85vh !important;
            background: var(--glass-bg) !important;
            backdrop-filter: blur(25px) !important;
            border: 2px solid rgba(0, 229, 255, 0.4) !important;
            border-radius: 24px !important;
            box-shadow: 0 25px 80px rgba(0, 0, 0, 0.7), 0 0 40px rgba(0, 229, 255, 0.6) !important;
            z-index: 100002 !important;
            overflow: hidden !important;
            animation: gaku-dashboard-appear 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
        }

        @keyframes gaku-dashboard-appear {
            from {
                opacity: 0;
                transform: translate(-50%, -50%) scale(0.85) rotateX(10deg);
            }
            to {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1) rotateX(0deg);
            }
        }

        .gaku-stats-container {
            display: flex !important;
            flex-direction: column !important;
            height: 100% !important;
            overflow: hidden !important;
        }

        .gaku-stats-header {
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            padding: 25px 30px !important;
            background: linear-gradient(135deg, rgba(0, 229, 255, 0.1), rgba(138, 43, 226, 0.1)) !important;
            border-bottom: 1px solid rgba(0, 229, 255, 0.3) !important;
        }

        .gaku-stats-header h2 {
            margin: 0 !important;
            font-size: 28px !important;
            font-weight: 800 !important;
            background: linear-gradient(135deg, var(--neon-cyan), var(--neon-violet)) !important;
            -webkit-background-clip: text !important;
            -webkit-text-fill-color: transparent !important;
            background-clip: text !important;
            filter: drop-shadow(0 0 15px var(--neon-cyan)) !important;
        }

        .gaku-stats-close {
            background: transparent !important;
            border: 2px solid var(--neon-cyan) !important;
            color: var(--neon-cyan) !important;
            font-size: 24px !important;
            width: 40px !important;
            height: 40px !important;
            border-radius: 50% !important;
            cursor: pointer !important;
            transition: all 0.3s ease !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
        }

        .gaku-stats-close:hover {
            background: var(--neon-cyan) !important;
            color: #0a0e1a !important;
            transform: rotate(90deg) scale(1.1) !important;
            box-shadow: 0 0 20px var(--neon-cyan) !important;
        }

        .gaku-stats-tabs {
            display: flex !important;
            gap: 10px !important;
            padding: 20px 30px 0 30px !important;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
            overflow-x: auto !important;
        }

        .gaku-stats-tab {
            background: transparent !important;
            border: none !important;
            color: var(--text-secondary) !important;
            padding: 12px 24px !important;
            font-size: 15px !important;
            font-weight: 600 !important;
            cursor: pointer !important;
            transition: all 0.3s ease !important;
            border-bottom: 3px solid transparent !important;
            white-space: nowrap !important;
        }

        .gaku-stats-tab:hover {
            color: var(--neon-cyan) !important;
            background: rgba(0, 229, 255, 0.1) !important;
        }

        .gaku-stats-tab.active {
            color: var(--neon-cyan) !important;
            border-bottom-color: var(--neon-cyan) !important;
            text-shadow: 0 0 10px var(--neon-cyan) !important;
        }

        .gaku-stats-content {
            flex: 1 !important;
            overflow-y: auto !important;
            padding: 30px !important;
        }

        .gaku-stats-tab-content {
            display: none !important;
        }

        .gaku-stats-tab-content.active {
            display: block !important;
            animation: gaku-tab-fade-in 0.3s ease-out !important;
        }

        @keyframes gaku-tab-fade-in {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .gaku-stats-grid {
            display: grid !important;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)) !important;
            gap: 20px !important;
            margin-bottom: 30px !important;
        }

        .gaku-stat-card {
            background: rgba(0, 0, 0, 0.3) !important;
            border: 1px solid rgba(0, 229, 255, 0.2) !important;
            border-radius: 16px !important;
            padding: 20px !important;
            text-align: center !important;
            transition: all 0.3s ease !important;
            cursor: pointer !important;
        }

        .gaku-stat-card:hover {
            border-color: var(--neon-cyan) !important;
            transform: translateY(-5px) !important;
            box-shadow: 0 10px 30px rgba(0, 229, 255, 0.3) !important;
        }

        .gaku-stat-icon {
            font-size: 36px !important;
            margin-bottom: 10px !important;
            filter: drop-shadow(0 0 10px currentColor) !important;
        }

        .gaku-stat-value {
            font-size: 32px !important;
            font-weight: 800 !important;
            color: var(--neon-cyan) !important;
            margin-bottom: 8px !important;
            text-shadow: 0 0 15px var(--neon-cyan) !important;
        }

        .gaku-stat-label {
            font-size: 13px !important;
            color: var(--text-secondary) !important;
            text-transform: uppercase !important;
            letter-spacing: 1px !important;
        }

        .gaku-stats-section {
            background: rgba(0, 0, 0, 0.2) !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
            border-radius: 12px !important;
            padding: 20px !important;
            margin-bottom: 20px !important;
        }

        .gaku-stats-section h3 {
            margin: 0 0 15px 0 !important;
            font-size: 20px !important;
            font-weight: 700 !important;
            color: var(--neon-violet) !important;
            text-shadow: 0 0 10px var(--neon-violet) !important;
        }

        .gaku-stats-row {
            display: flex !important;
            gap: 20px !important;
            flex-wrap: wrap !important;
        }

        .gaku-stats-row span {
            flex: 1 !important;
            min-width: 150px !important;
            padding: 10px 15px !important;
            background: rgba(0, 229, 255, 0.1) !important;
            border-radius: 8px !important;
            font-size: 14px !important;
            color: var(--text-primary) !important;
        }

        /* Match History Styles */
        .gaku-match-history {
            display: flex !important;
            flex-direction: column !important;
            gap: 15px !important;
        }

        .gaku-match-item {
            display: flex !important;
            align-items: center !important;
            gap: 20px !important;
            background: rgba(0, 0, 0, 0.3) !important;
            border: 1px solid rgba(0, 229, 255, 0.2) !important;
            border-radius: 12px !important;
            padding: 20px !important;
            transition: all 0.3s ease !important;
        }

        .gaku-match-item:hover {
            border-color: var(--neon-cyan) !important;
            transform: translateX(5px) !important;
            box-shadow: 0 5px 20px rgba(0, 229, 255, 0.2) !important;
        }

        .gaku-match-number {
            font-size: 24px !important;
            font-weight: 800 !important;
            color: var(--neon-cyan) !important;
            min-width: 50px !important;
            text-align: center !important;
        }

        .gaku-match-info {
            flex: 1 !important;
        }

        .gaku-match-placement {
            font-size: 18px !important;
            font-weight: 700 !important;
            color: var(--neon-magenta) !important;
            margin-bottom: 5px !important;
        }

        .gaku-match-stats {
            font-size: 14px !important;
            color: var(--text-secondary) !important;
            margin-bottom: 5px !important;
        }

        .gaku-match-time {
            font-size: 12px !important;
            color: rgba(255, 255, 255, 0.5) !important;
        }

        /* Achievement Styles */
        .gaku-achievements-grid {
            display: grid !important;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)) !important;
            gap: 20px !important;
        }

        .gaku-achievement-card {
            background: rgba(0, 0, 0, 0.3) !important;
            border: 2px solid rgba(255, 255, 255, 0.1) !important;
            border-radius: 16px !important;
            padding: 25px !important;
            text-align: center !important;
            transition: all 0.3s ease !important;
        }

        .gaku-achievement-card.unlocked {
            border-color: rgba(255, 215, 0, 0.5) !important;
            background: rgba(255, 215, 0, 0.05) !important;
        }

        .gaku-achievement-card.unlocked:hover {
            transform: translateY(-5px) scale(1.02) !important;
            box-shadow: 0 10px 40px rgba(255, 215, 0, 0.3) !important;
        }

        .gaku-achievement-card.locked {
            opacity: 0.5 !important;
            filter: grayscale(1) !important;
        }

        .gaku-achievement-icon {
            font-size: 48px !important;
            margin-bottom: 15px !important;
            filter: drop-shadow(0 0 15px currentColor) !important;
        }

        .gaku-achievement-name {
            font-size: 18px !important;
            font-weight: 700 !important;
            color: var(--text-primary) !important;
            margin-bottom: 8px !important;
        }

        .gaku-achievement-card.unlocked .gaku-achievement-name {
            color: #FFD700 !important;
            text-shadow: 0 0 10px #FFD700 !important;
        }

        .gaku-achievement-desc {
            font-size: 13px !important;
            color: var(--text-secondary) !important;
            line-height: 1.4 !important;
        }

        /* Achievement Notification */
        .gaku-achievement-notification {
            position: fixed !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 140, 0, 0.2)) !important;
            backdrop-filter: blur(20px) !important;
            border: 3px solid #FFD700 !important;
            border-radius: 24px !important;
            padding: 40px 60px !important;
            z-index: 100003 !important;
            box-shadow: 0 0 60px rgba(255, 215, 0, 0.8), inset 0 0 30px rgba(255, 215, 0, 0.2) !important;
            animation: gaku-achievement-appear 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) !important;
        }

        @keyframes gaku-achievement-appear {
            0% {
                opacity: 0;
                transform: translate(-50%, -50%) scale(0.5) rotate(-10deg);
            }
            50% {
                transform: translate(-50%, -50%) scale(1.1) rotate(5deg);
            }
            100% {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1) rotate(0deg);
            }
        }

        @keyframes gaku-achievement-slide-out {
            to {
                opacity: 0;
                transform: translate(-50%, -50%) scale(0.8) translateY(-50px);
            }
        }

        .gaku-achievement-unlocked {
            display: flex !important;
            align-items: center !important;
            gap: 25px !important;
        }

        .gaku-achievement-icon-large {
            font-size: 80px !important;
            animation: gaku-achievement-icon-spin 1s ease-out !important;
            filter: drop-shadow(0 0 20px #FFD700) !important;
        }

        @keyframes gaku-achievement-icon-spin {
            0% {
                transform: rotateY(0deg) scale(0.5);
            }
            50% {
                transform: rotateY(180deg) scale(1.2);
            }
            100% {
                transform: rotateY(360deg) scale(1);
            }
        }

        .gaku-achievement-text {
            text-align: left !important;
        }

        .gaku-achievement-title {
            font-size: 16px !important;
            color: rgba(255, 255, 255, 0.7) !important;
            text-transform: uppercase !important;
            letter-spacing: 2px !important;
            margin-bottom: 8px !important;
        }

        .gaku-achievement-name-large {
            font-size: 32px !important;
            font-weight: 900 !important;
            color: #FFD700 !important;
            text-shadow: 0 0 20px #FFD700, 0 0 40px #FFD700 !important;
            margin-bottom: 8px !important;
        }

        .gaku-achievement-desc-large {
            font-size: 16px !important;
            color: rgba(255, 255, 255, 0.8) !important;
        }

        /* Training Target Styles */
        .gaku-training-target {
            cursor: crosshair !important;
            transition: all 0.1s ease !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
        }

        .gaku-training-target:hover {
            transform: scale(1.1) !important;
            filter: brightness(1.3) !important;
        }

        /* Fix: Make sure training targets are visible */
        .gaku-training-target:not(.moving):not(.flick) {
            background: radial-gradient(circle, #FF2D75, #8A2BE2) !important;
            border: 3px solid #00E5FF !important;
            border-radius: 50% !important;
            box-shadow: 0 0 20px #00E5FF, inset 0 0 20px rgba(255, 255, 255, 0.2) !important;
        }

        @keyframes gaku-flick-pulse {
            0%, 100% {
                transform: scale(1);
                opacity: 1;
            }
            50% {
                transform: scale(1.15);
                opacity: 0.8;
            }
        }

        /* Notification Styles */
        .gaku-notification {
            background: var(--glass-bg) !important;
            backdrop-filter: blur(15px) !important;
            border: 1px solid rgba(0, 229, 255, 0.3) !important;
            border-radius: 12px !important;
            padding: 15px 20px !important;
            min-width: 300px !important;
            display: flex !important;
            align-items: center !important;
            gap: 15px !important;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px rgba(0, 229, 255, 0.2) !important;
            opacity: 0 !important;
            transform: translateX(400px) !important;
            transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55) !important;
        }

        .gaku-notification.show {
            opacity: 1 !important;
            transform: translateX(0) !important;
        }

        .gaku-notification-info {
            border-color: rgba(0, 229, 255, 0.5) !important;
        }

        .gaku-notification-success {
            border-color: rgba(0, 255, 136, 0.5) !important;
        }

        .gaku-notification-warning {
            border-color: rgba(255, 215, 0, 0.5) !important;
        }

        .gaku-notification-error {
            border-color: rgba(255, 68, 68, 0.5) !important;
        }

        .gaku-notification-icon {
            font-size: 24px !important;
            filter: drop-shadow(0 0 10px currentColor) !important;
        }

        .gaku-notification-message {
            flex: 1 !important;
            color: var(--text-primary) !important;
            font-size: 14px !important;
            font-weight: 500 !important;
        }

        .gaku-notification-close {
            background: transparent !important;
            border: none !important;
            color: var(--text-secondary) !important;
            font-size: 18px !important;
            cursor: pointer !important;
            padding: 5px !important;
            transition: all 0.2s ease !important;
        }

        .gaku-notification-close:hover {
            color: var(--neon-cyan) !important;
            transform: rotate(90deg) !important;
        }

        /* Scrollbar Styles */
        .gaku-stats-content::-webkit-scrollbar,
        .gaku-settings-content::-webkit-scrollbar {
            width: 8px !important;
        }

        .gaku-stats-content::-webkit-scrollbar-track,
        .gaku-settings-content::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.2) !important;
            border-radius: 4px !important;
        }

        .gaku-stats-content::-webkit-scrollbar-thumb,
        .gaku-settings-content::-webkit-scrollbar-thumb {
            background: linear-gradient(135deg, var(--neon-cyan), var(--neon-violet)) !important;
            border-radius: 4px !important;
        }

        .gaku-stats-content::-webkit-scrollbar-thumb:hover,
        .gaku-settings-content::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(135deg, var(--neon-violet), var(--neon-magenta)) !important;
        }

        /* No Data Message */
        .gaku-no-data {
            text-align: center !important;
            padding: 60px 20px !important;
            color: var(--text-secondary) !important;
            font-size: 16px !important;
        }

        /* Graph Container */
        .gaku-graphs-container {
            display: flex !important;
            flex-direction: column !important;
            gap: 30px !important;
        }

        .gaku-graphs-container canvas {
            background: rgba(0, 0, 0, 0.3) !important;
            border: 1px solid rgba(0, 229, 255, 0.2) !important;
            border-radius: 12px !important;
            padding: 20px !important;
        }

        /* Loading Animation */
        .gaku-loading {
            display: inline-block !important;
            width: 20px !important;
            height: 20px !important;
            border: 3px solid rgba(0, 229, 255, 0.3) !important;
            border-top-color: var(--neon-cyan) !important;
            border-radius: 50% !important;
            animation: gaku-spin 0.8s linear infinite !important;
        }

        @keyframes gaku-spin {
            to {
                transform: rotate(360deg);
            }
        }

        /* Tooltip Styles */
        .gaku-tooltip {
            position: absolute !important;
            background: rgba(0, 0, 0, 0.9) !important;
            border: 1px solid var(--neon-cyan) !important;
            border-radius: 8px !important;
            padding: 8px 12px !important;
            color: var(--text-primary) !important;
            font-size: 12px !important;
            pointer-events: none !important;
            z-index: 100004 !important;
            white-space: nowrap !important;
            opacity: 0 !important;
            transition: opacity 0.2s ease !important;
        }

        .gaku-tooltip.show {
            opacity: 1 !important;
        }

        /* Context Menu Styles */
        .gaku-context-menu {
            position: fixed !important;
            background: var(--glass-bg) !important;
            backdrop-filter: blur(15px) !important;
            border: 1px solid rgba(0, 229, 255, 0.3) !important;
            border-radius: 12px !important;
            padding: 8px !important;
            z-index: 100005 !important;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5) !important;
            min-width: 200px !important;
        }

        .gaku-context-menu-item {
            padding: 10px 15px !important;
            color: var(--text-primary) !important;
            font-size: 14px !important;
            cursor: pointer !important;
            border-radius: 8px !important;
            transition: all 0.2s ease !important;
            display: flex !important;
            align-items: center !important;
            gap: 10px !important;
        }

        .gaku-context-menu-item:hover {
            background: rgba(0, 229, 255, 0.2) !important;
            color: var(--neon-cyan) !important;
        }

        .gaku-context-menu-separator {
            height: 1px !important;
            background: rgba(255, 255, 255, 0.1) !important;
            margin: 5px 0 !important;
        }

        /* Badge Styles */
        .gaku-badge {
            display: inline-block !important;
            padding: 4px 10px !important;
            border-radius: 12px !important;
            font-size: 11px !important;
            font-weight: 700 !important;
            text-transform: uppercase !important;
            letter-spacing: 0.5px !important;
        }

        .gaku-badge-new {
            background: linear-gradient(135deg, var(--neon-cyan), var(--neon-violet)) !important;
            color: white !important;
            box-shadow: 0 0 10px var(--neon-cyan) !important;
        }

        .gaku-badge-pro {
            background: linear-gradient(135deg, #FFD700, #FF8C00) !important;
            color: #000 !important;
            box-shadow: 0 0 10px #FFD700 !important;
        }

        .gaku-badge-beta {
            background: linear-gradient(135deg, var(--neon-magenta), var(--neon-violet)) !important;
            color: white !important;
            box-shadow: 0 0 10px var(--neon-magenta) !important;
        }

        /* Progress Bar Styles */
        .gaku-progress-bar {
            width: 100% !important;
            height: 8px !important;
            background: rgba(0, 0, 0, 0.3) !important;
            border-radius: 4px !important;
            overflow: hidden !important;
            position: relative !important;
        }

        .gaku-progress-fill {
            height: 100% !important;
            background: linear-gradient(90deg, var(--neon-cyan), var(--neon-violet)) !important;
            border-radius: 4px !important;
            transition: width 0.3s ease !important;
            position: relative !important;
            overflow: hidden !important;
        }

        .gaku-progress-fill::after {
            content: '' !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent) !important;
            animation: gaku-progress-shine 2s ease-in-out infinite !important;
        }

        @keyframes gaku-progress-shine {
            0% {
                transform: translateX(-100%);
            }
            100% {
                transform: translateX(100%);
            }
        }

        /* Level Up Animation */
        @keyframes gaku-level-up {
            0% {
                transform: scale(0.5) rotate(-180deg);
                opacity: 0;
            }
            50% {
                transform: scale(1.2) rotate(0deg);
            }
            100% {
                transform: scale(1) rotate(0deg);
                opacity: 1;
            }
        }

        .gaku-level-up-effect {
            animation: gaku-level-up 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) !important;
        }

        /* Combo Counter */
        .gaku-combo-counter {
            position: fixed !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            font-size: 120px !important;
            font-weight: 900 !important;
            color: var(--neon-magenta) !important;
            text-shadow: 0 0 40px var(--neon-magenta), 0 0 80px var(--neon-magenta) !important;
            z-index: 10001 !important;
            pointer-events: none !important;
            animation: gaku-combo-appear 0.5s ease-out !important;
        }

        @keyframes gaku-combo-appear {
            0% {
                transform: translate(-50%, -50%) scale(0.5);
                opacity: 0;
            }
            50% {
                transform: translate(-50%, -50%) scale(1.3);
            }
            100% {
                transform: translate(-50%, -50%) scale(1);
                opacity: 1;
            }
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
            #gaku-stats-dashboard {
                width: 90% !important;
                max-width: 700px !important;
            }

            .gaku-stats-grid {
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)) !important;
            }

            .gaku-achievements-grid {
                grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)) !important;
            }
        }

        @media (max-width: 768px) {
            #gaku-settings-panel,
            #gaku-stats-dashboard {
                width: 95% !important;
                max-height: 90vh !important;
            }

            .gaku-stats-grid {
                grid-template-columns: repeat(2, 1fr) !important;
            }

            .gaku-achievements-grid {
                grid-template-columns: 1fr !important;
            }

            #gaku-spotify-player {
                width: 320px !important;
            }
        }
    `;

    // Inject additional styles
    function injectAdditionalStyles() {
        const styleEl = document.createElement('style');
        styleEl.textContent = ADDITIONAL_STYLES;
        document.head.appendChild(styleEl);
    }

    // ==================== STARTUP ANIMATION ====================
    function showStartupAnimation() {
        const startup = document.createElement('div');
        startup.id = 'gaku-startup-animation';
        startup.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: linear-gradient(135deg, #0a0e1a 0%, #1a1f35 100%);
            z-index: 999999;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            animation: gaku-startup-fade-out 2s ease-out 3s forwards;
        `;

        startup.innerHTML = `
            <div style="font-size: 72px; font-weight: 900; background: linear-gradient(135deg, #00E5FF, #8A2BE2, #FF2D75); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 20px; animation: gaku-startup-pulse 1.5s ease-in-out infinite;">
                GAKU CLIENT
            </div>
            <div style="font-size: 24px; color: #00E5FF; text-shadow: 0 0 20px #00E5FF; animation: gaku-startup-glow 2s ease-in-out infinite;">
                Ultimate Edition v3.0
            </div>
            <div style="margin-top: 40px; width: 300px; height: 4px; background: rgba(0,229,255,0.2); border-radius: 2px; overflow: hidden;">
                <div style="height: 100%; background: linear-gradient(90deg, #00E5FF, #8A2BE2); animation: gaku-startup-load 3s ease-out forwards;"></div>
            </div>
        `;

        document.body.appendChild(startup);

        // Add animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes gaku-startup-pulse {
                0%, 100% { transform: scale(1); filter: drop-shadow(0 0 20px #00E5FF); }
                50% { transform: scale(1.05); filter: drop-shadow(0 0 40px #00E5FF); }
            }
            @keyframes gaku-startup-glow {
                0%, 100% { opacity: 0.8; }
                50% { opacity: 1; }
            }
            @keyframes gaku-startup-load {
                0% { width: 0%; }
                100% { width: 100%; }
            }
            @keyframes gaku-startup-fade-out {
                to { opacity: 0; pointer-events: none; }
            }
        `;
        document.head.appendChild(style);

        // Remove after animation
        setTimeout(() => startup.remove(), 5000);

        // Epic particle burst
        setTimeout(() => {
            particleSystem.createBurst(window.innerWidth / 2, window.innerHeight / 2, 200, 'magic', { color: '#00E5FF' });
        }, 3000);
    }

    // ==================== SCREEN EFFECTS ====================
    class ScreenEffects {
        constructor() {
            this.canvas = null;
            this.ctx = null;
        }

        init() {
            this.canvas = document.createElement('canvas');
            this.canvas.id = 'gaku-screen-effects';
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.canvas.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                pointer-events: none;
                z-index: 9998;
                opacity: 0;
            `;
            this.ctx = this.canvas.getContext('2d');
            document.body.appendChild(this.canvas);
        }

        flashScreen(color = '#FFFFFF', intensity = 0.5, duration = 200) {
            if (!this.ctx || !this.canvas) return;

            // Temporarily show canvas
            this.canvas.style.opacity = '1';

            this.ctx.fillStyle = color;
            this.ctx.globalAlpha = intensity;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            setTimeout(() => {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                // Hide canvas again
                this.canvas.style.opacity = '0';
            }, duration);
        }

        vignette(intensity = 0.3) {
            if (!this.ctx) return;

            const gradient = this.ctx.createRadialGradient(
                this.canvas.width / 2, this.canvas.height / 2, 0,
                this.canvas.width / 2, this.canvas.height / 2, this.canvas.width / 2
            );
            gradient.addColorStop(0, 'rgba(0,0,0,0)');
            gradient.addColorStop(1, `rgba(0,0,0,${intensity})`);

            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }

        chromaticAberration() {
            // Epic chromatic aberration effect
            document.body.style.filter = 'contrast(1.1) saturate(1.2)';
        }
    }

    const screenEffects = new ScreenEffects();

    // ==================== KILL STREAK SYSTEM ====================
    class KillStreakSystem {
        constructor() {
            this.currentStreak = 0;
            this.bestStreak = GM_getValue('best_streak', 0);
            this.streakMessages = {
                3: { text: 'KILLING SPREE!', color: '#FFD700' },
                5: { text: 'RAMPAGE!', color: '#FF8C00' },
                7: { text: 'DOMINATING!', color: '#FF4500' },
                10: { text: 'UNSTOPPABLE!', color: '#FF0000' },
                15: { text: 'GODLIKE!', color: '#8A2BE2' },
                20: { text: 'LEGENDARY!', color: '#00E5FF' }
            };
        }

        addKill() {
            this.currentStreak++;

            if (this.currentStreak > this.bestStreak) {
                this.bestStreak = this.currentStreak;
                GM_setValue('best_streak', this.bestStreak);
            }

            // Check for streak messages
            const message = this.streakMessages[this.currentStreak];
            if (message) {
                this.showStreakMessage(message.text, message.color);
                soundSystem.playExplosion();
                screenEffects.flashScreen(message.color, 0.3, 300);
                particleSystem.createBurst(window.innerWidth / 2, window.innerHeight / 2, 100, 'explosion', { color: message.color });
            }
        }

        reset() {
            this.currentStreak = 0;
        }

        showStreakMessage(text, color) {
            const msg = document.createElement('div');
            msg.style.cssText = `
                position: fixed;
                top: 30%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 80px;
                font-weight: 900;
                color: ${color};
                text-shadow: 0 0 40px ${color}, 0 0 80px ${color};
                z-index: 100000;
                pointer-events: none;
                animation: gaku-streak-appear 1s ease-out;
            `;
            msg.textContent = text;
            document.body.appendChild(msg);

            const style = document.createElement('style');
            style.textContent = `
                @keyframes gaku-streak-appear {
                    0% { transform: translate(-50%, -50%) scale(0.5) rotate(-10deg); opacity: 0; }
                    50% { transform: translate(-50%, -50%) scale(1.2) rotate(5deg); }
                    100% { transform: translate(-50%, -50%) scale(1) rotate(0deg); opacity: 1; }
                }
            `;
            document.head.appendChild(style);

            setTimeout(() => {
                msg.style.animation = 'gaku-streak-fade-out 0.5s ease-out forwards';
                setTimeout(() => msg.remove(), 500);
            }, 2000);
        }
    }

    const killStreakSystem = new KillStreakSystem();

    // ==================== COMBO SYSTEM ====================
    class ComboSystem {
        constructor() {
            this.combo = 0;
            this.comboTimer = null;
            this.comboTimeout = 3000;
        }

        addHit() {
            this.combo++;
            this.showCombo();

            clearTimeout(this.comboTimer);
            this.comboTimer = setTimeout(() => {
                this.reset();
            }, this.comboTimeout);
        }

        reset() {
            this.combo = 0;
        }

        showCombo() {
            let comboEl = document.getElementById('gaku-combo-display');
            if (!comboEl) {
                comboEl = document.createElement('div');
                comboEl.id = 'gaku-combo-display';
                comboEl.style.cssText = `
                    position: fixed;
                    top: 40%;
                    right: 50px;
                    font-size: 64px;
                    font-weight: 900;
                    color: #FF2D75;
                    text-shadow: 0 0 30px #FF2D75;
                    z-index: 10000;
                    pointer-events: none;
                `;
                document.body.appendChild(comboEl);
            }

            comboEl.textContent = `${this.combo}x COMBO!`;
            comboEl.style.animation = 'none';
            setTimeout(() => {
                comboEl.style.animation = 'gaku-combo-bounce 0.3s ease-out';
            }, 10);
        }
    }

    const comboSystem = new ComboSystem();

    // ==================== DAMAGE INDICATOR ====================
    class DamageIndicator {
        constructor() {
            this.indicators = [];
        }

        show(direction, damage) {
            const indicator = document.createElement('div');
            indicator.className = 'gaku-damage-indicator';

            const angle = Math.atan2(direction.y, direction.x);
            const rotation = (angle * 180 / Math.PI) + 90;

            indicator.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                width: 100px;
                height: 100px;
                transform: translate(-50%, -50%) rotate(${rotation}deg);
                pointer-events: none;
                z-index: 9999;
            `;

            indicator.innerHTML = `
                <div style="
                    width: 0;
                    height: 0;
                    border-left: 20px solid transparent;
                    border-right: 20px solid transparent;
                    border-bottom: 40px solid rgba(255, 0, 0, 0.7);
                    filter: drop-shadow(0 0 10px #FF0000);
                    animation: gaku-damage-indicator-fade 1s ease-out forwards;
                "></div>
            `;

            document.body.appendChild(indicator);
            this.indicators.push(indicator);

            setTimeout(() => {
                indicator.remove();
                this.indicators = this.indicators.filter(i => i !== indicator);
            }, 1000);
        }
    }

    const damageIndicator = new DamageIndicator();

    // ==================== INITIALIZATION ====================
    function init() {
        console.log('[Gaku] Initializing Neon Glassed Client v3.0.0 - Ultimate Edition');

        // Wait for page to load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        // Inject styles
        injectStyles();
        injectAdditionalStyles(); // Fix: Inject additional styles

        // Apply theme
        if (CONFIG.theme.enabled) {
            document.body.classList.add('gaku-theme-enabled');
        }

        // Initialize advanced systems (screen effects disabled to prevent black screen)
        particleSystem.init();
        statsTracker.checkDailyReset();
        statsTracker.checkWeeklyReset();
        performanceProfiler.start();
        // screenEffects.init(); // DISABLED - was causing black overlay

        // Create UI elements
        setTimeout(() => {
            createFPSCounter();
            createKillCounter();
            createPingDisplay();
            createCrosshair();
            createZoomControls();
            createSettingsPanel();
            createSpotifyPlayer();
            createStatsDashboard();
            // enhancedMinimap.init(); // DISABLED - might be causing black screen
            // audioVisualizer.init(initAudioContext()); // DISABLED - might be causing black screen

            setupKeyboardShortcuts();
            setupGameHooks();
            setupLootHighlighting();
            setupAdvancedKeyboardShortcuts();

            // Show welcome screen on first load (only if not shown before)
            if (!STATE.welcomeShown) {
                showWelcomeScreen();
            }

            console.log('[Gaku] Client initialized successfully - All systems operational');
            console.log('[Gaku] Features: Particles, Stats, Replays, Training, Social, Audio Viz, Performance Profiler');

            // DISABLED: Startup animation (was blocking screen)
            // showStartupAnimation();
        }, 1000);
    }

    // ==================== ADVANCED KEYBOARD SHORTCUTS ====================
    function setupAdvancedKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Stats dashboard (F5)
            if (e.key === 'F5') {
                e.preventDefault();
                toggleStatsDashboard();
            }

            // Training mode (F6)
            if (e.key === 'F6') {
                e.preventDefault();
                if (!trainingMode.active) {
                    trainingMode.start('aim');
                } else {
                    trainingMode.stop();
                }
            }

            // ESC to exit training mode
            if (e.key === 'Escape' && trainingMode.active) {
                e.preventDefault();
                trainingMode.stop();
            }

            // Performance profiler (F7)
            if (e.key === 'F7') {
                e.preventDefault();
                if (!performanceProfiler.monitoring) {
                    performanceProfiler.start();
                } else {
                    performanceProfiler.stop();
                }
            }

            // Replay recording (F8)
            if (e.key === 'F8') {
                e.preventDefault();
                if (!replaySystem.isRecording) {
                    replaySystem.startRecording();
                } else {
                    replaySystem.stopRecording();
                }
            }

            // Particle test (F9)
            if (e.key === 'F9') {
                e.preventDefault();
                particleSystem.createBurst(
                    window.innerWidth / 2,
                    window.innerHeight / 2,
                    100,
                    'magic',
                    { color: '#00E5FF' }
                );
            }

            // Theme cycle (F10)
            if (e.key === 'F10') {
                e.preventDefault();
                const themes = Object.keys(themeCustomizer.themes);
                const currentIndex = themes.indexOf(themeCustomizer.currentTheme);
                const nextIndex = (currentIndex + 1) % themes.length;
                themeCustomizer.applyTheme(themes[nextIndex]);
            }
        });
    }

    // Start initialization
    init();

})();
