// ==UserScript==
// @name         Drawaria CHRISTMAS JUKEBOX 🎄
// @namespace    http://violentmonkey.com/
// @version      7.0
// @description  ¡Escucha tus villancicos favoritos con este reproductor con temática navideña!
// @match        https://drawaria.online/*
// @match        https://drawaria.online/test
// @match        https://n.drawaria.online/
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @author       YouTubeDrawaria / Christmas Edit
// @downloadURL https://update.greasyfork.org/scripts/554818/Drawaria%20CHRISTMAS%20JUKEBOX%20%F0%9F%8E%84.user.js
// @updateURL https://update.greasyfork.org/scripts/554818/Drawaria%20CHRISTMAS%20JUKEBOX%20%F0%9F%8E%84.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- ESTILOS NAVIDEÑOS (RED, GREEN, GOLD) ---
    const style = document.createElement('style');
    style.textContent = `
    #music-mod {
        position: fixed;
        top: 20px;
        right: 20px;
        width: 320px;
        max-height: 80vh;
        /* Fondo: Rojo de terciopelo oscuro */
        background: rgba(48, 8, 8, 0.95);
        /* Borde: Dorado */
        border: 1px solid #ffd700;
        border-radius: 12px;
        padding: 0;
        z-index: 9999;
        color: white;
        font-family: 'Segoe UI', sans-serif;
        /* Sombra: Roja festiva */
        box-shadow: 0 10px 25px rgba(255, 50, 50, 0.5);
        backdrop-filter: blur(8px);
        overflow: hidden;
        transition: all 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
    }

    #music-mod-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px;
        /* Fondo: Degradado de Rojo a Verde */
        background: linear-gradient(to right, #8b0000, #006400);
        cursor: move;
        user-select: none;
    }

    #music-mod-title {
        margin: 0;
        /* Color: Dorado brillante */
        color: #ffcc00;
        font-size: 18px;
        font-weight: 600;
        /* Sombra: Resplandor festivo */
        text-shadow: 0 0 10px rgba(255, 255, 200, 0.8);
    }

    #music-mod-controls {
        display: flex;
        gap: 8px;
    }

    .mod-btn-control {
        width: 24px;
        height: 24px;
        border: none;
        border-radius: 6px;
        /* Fondo: Rojo oscuro transparente */
        background: rgba(160, 0, 0, 0.4);
        /* Color: Blanco Nieve */
        color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s;
    }

    .mod-btn-control:hover {
        /* Fondo: Rojo brillante transparente */
        background: rgba(255, 50, 50, 0.6);
        transform: scale(1.1);
    }

    #music-mod-content {
        padding: 15px;
        overflow-y: auto;
        max-height: calc(80vh - 60px);
    }

    .mod-btn {
        width: 100%;
        padding: 12px 15px;
        margin: 8px 0;
        border: none;
        border-radius: 8px;
        /* Fondo: Degradado de Rojo Oscuro a Verde Oscuro */
        background: linear-gradient(135deg, #8b0000, #004d00);
        color: white;
        font-weight: 500;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.3s;
        position: relative;
        overflow: hidden;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
    }

    .mod-btn::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        /* Efecto Nieve/Brillo */
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.3), transparent);
        opacity: 0;
        transition: opacity 0.3s;
    }

    .mod-btn:hover {
        /* Fondo: Rojo Naranja a Verde Bosque */
        background: linear-gradient(135deg, #ff4500, #228b22);
        /* Sombra: Dorado */
        box-shadow: 0 6px 10px rgba(255, 215, 0, 0.5);
        transform: translateY(-2px);
    }

    .mod-btn:hover::before {
        opacity: 1;
    }

    .mod-btn:active {
        transform: translateY(0);
    }

    .mod-btn i {
        font-size: 16px;
    }

    .mod-section {
        margin: 15px 0;
        padding: 15px;
        /* Fondo de sección: Gris oscuro navideño */
        background: rgba(30, 0, 0, 0.6);
        border-radius: 10px;
        /* Borde: Dorado */
        border: 1px solid #ffd700;
    }

    .mod-section-title {
        margin: 0 0 12px 0;
        /* Color: Dorado brillante */
        color: #ffcc00;
        font-size: 14px;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    /* Scrollbar con colores navideños */
    #music-mod-content::-webkit-scrollbar {
        width: 6px;
    }

    #music-mod-content::-webkit-scrollbar-track {
        background: rgba(50, 10, 10, 0.3);
        border-radius: 3px;
    }

    #music-mod-content::-webkit-scrollbar-thumb {
        /* Degradado de Rojo a Verde */
        background: linear-gradient(#a00000, #008000);
        border-radius: 3px;
    }

    /* Animación de pulso */
    @keyframes pulse {
        0% { box-shadow: 0 0 0 0 rgba(255, 215, 0, 0.4); } /* Dorado */
        70% { box-shadow: 0 0 0 12px rgba(255, 215, 0, 0); }
        100% { box-shadow: 0 0 0 0 rgba(255, 215, 0, 0); }
    }

    .playing {
        animation: pulse 2s infinite;
    }

    select, input[type="text"], input[type="range"] {
        width: 100%;
        padding: 8px;
        margin: 5px 0;
        /* Fondo: Rojo muy oscuro */
        background: rgba(60, 10, 10, 0.7);
        /* Borde: Dorado */
        border: 1px solid #ffd700;
        border-radius: 6px;
        color: white;
    }

    input[type="range"] {
        padding: 0;
        height: 6px;
        -webkit-appearance: none;
    }

    input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 16px;
        height: 16px;
        /* Pulgar del slider: Dorado */
        background: #ffcc00;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 0 5px rgba(255, 215, 0, 0.5);
    }
    `;
    document.head.appendChild(style);

    // --- ESTRUCTURA HTML (Nuevos Títulos e Iconos) ---
    const mod = document.createElement('div');
    mod.id = 'music-mod';
    mod.innerHTML = `
    <div id="music-mod-header">
        <h3 id="music-mod-title">🎄 CHRISTMAS JUKEBOX 🎶</h3>
        <div id="music-mod-controls">
            <button id="collapse-btn" class="mod-btn-control">−</button>
            <button id="close-btn" class="mod-btn-control">×</button>
        </div>
    </div>
    <div id="music-mod-content">
        <div class="mod-section">
            <div class="mod-section-title">🔔 CAROL CONTROL</div>
            <button id="add-music-btn" class="mod-btn"><i>🎁</i> ADD CAROLS</button>
            <input type="file" id="file-input" accept=".mp3,audio/*" multiple style="display:none">
            <select id="song-list" size="4"></select>

            <div style="display:flex; gap:8px; margin-top:10px;">
                <button id="play-btn" class="mod-btn" style="flex:1;"><i>▶️</i> PLAY</button>
                <button id="stop-btn" class="mod-btn" style="flex:1;"><i>⏹</i> STOP</button>
            </div>

            <div style="display:flex; gap:8px;">
                <button id="prev-btn" class="mod-btn" style="flex:1;"><i>⏮</i> PREVIOUS</button>
                <button id="next-btn" class="mod-btn" style="flex:1;"><i>⏭</i> NEXT</button>
            </div>
        </div>

        <div class="mod-section">
            <div class="mod-section-title">✨ SETTINGS</div>
            <div style="margin:12px 0;">
                <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                    <span style="color:#ffcc00;">SPEED:</span>
                    <span id="speed-value" style="color:#ffffff;">1.0x</span>
                </div>
                <input type="range" id="speed-slider" min="0.5" max="2" step="0.1" value="1">
            </div>

            <div style="margin:12px 0;">
                <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                    <span style="color:#ffcc00;">VOLUME:</span>
                    <span id="volume-value" style="color:#ffffff;">70%</span>
                </div>
                <input type="range" id="volume-slider" min="0" max="1" step="0.1" value="0.7">
            </div>

            <div style="display:flex; gap:8px;">
                <button id="loop-btn" class="mod-btn" style="flex:1;"><i>🔁</i> LOOP</button>
                <button id="shuffle-btn" class="mod-btn" style="flex:1;"><i>🔀</i> SHUFFLE</button>
            </div>
        </div>

        <div class="mod-section">
            <div class="mod-section-title">🎅 PLAYLIST MANAGEMENT</div>
            <input type="text" id="playlist-name" placeholder="Playlist Name">
            <button id="save-playlist-btn" class="mod-btn"><i>💾</i> SAVE PRESENT</button>
            <select id="playlist-select"></select>
            <div style="display:flex; gap:8px;">
                <button id="load-playlist-btn" class="mod-btn" style="flex:1;"><i>🎄</i> OPEN PRESENT</button>
                <button id="delete-playlist-btn" class="mod-btn" style="flex:1;"><i>🗑️</i> DELETE SACK</button>
            </div>
        </div>
    </div>
    `;
    document.body.appendChild(mod);

    // --- LÓGICA DEL SCRIPT (Sin cambios funcionales mayores) ---
    // Initialize player
    const audio = new Audio();
    let songs = [];
    let currentSongIndex = 0;
    let isPlaying = false;
    let loopMode = true;
    let isShuffled = false;
    let originalPlaylist = [];

    // Get all elements
    const modElement = document.getElementById('music-mod');
    const header = document.getElementById('music-mod-header');
    const content = document.getElementById('music-mod-content');
    const collapseBtn = document.getElementById('collapse-btn');
    const closeBtn = document.getElementById('close-btn');
    const addBtn = document.getElementById('add-music-btn');
    const fileInput = document.getElementById('file-input');
    const songList = document.getElementById('song-list');
    const playBtn = document.getElementById('play-btn');
    const stopBtn = document.getElementById('stop-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const loopBtn = document.getElementById('loop-btn');
    const shuffleBtn = document.getElementById('shuffle-btn');
    const speedSlider = document.getElementById('speed-slider');
    const volumeSlider = document.getElementById('volume-slider');
    const playlistNameInput = document.getElementById('playlist-name');
    const savePlaylistBtn = document.getElementById('save-playlist-btn');
    const playlistSelect = document.getElementById('playlist-select');
    const loadPlaylistBtn = document.getElementById('load-playlist-btn');
    const deletePlaylistBtn = document.getElementById('delete-playlist-btn');

    // Key for storing playlists
    const PLAYLIST_STORAGE_KEY = "music_player_playlists_christmas"; // Changed key to avoid conflict

    // Function to save playlist
    function savePlaylist() {
        const name = playlistNameInput.value.trim();
        if (!name) {
            alert("Please enter a playlist name!");
            return;
        }

        // Get the current list of playlists
        const playlists = JSON.parse(localStorage.getItem(PLAYLIST_STORAGE_KEY) || "{}");

        // Save the playlist
        // NOTE: Saving local files this way (with Blob URLs) will only work for the current session!
        playlists[name] = {
            songs: songs.map(song => ({
                name: song.name,
                url: song.url
            })),
            currentIndex: currentSongIndex
        };

        localStorage.setItem(PLAYLIST_STORAGE_KEY, JSON.stringify(playlists));
        updatePlaylists();
        alert(`Christmas Playlist "${name}" saved successfully! (Note: Local file playback requires re-adding files after session refresh)`);
        playlistNameInput.value = '';
    }

    // Function to load playlist
    function loadPlaylist() {
        const name = playlistSelect.value;
        if (!name) return;

        const playlists = JSON.parse(localStorage.getItem(PLAYLIST_STORAGE_KEY) || "{}");
        const playlist = playlists[name];

        if (playlist) {
            // NOTE: Only playlist names and structure are loaded. Actual music files will need to be re-added
            // or the URLs must point to public/permanent sources, which this script doesn't handle.
            songs = playlist.songs;
            currentSongIndex = playlist.currentIndex || 0;
            updateSongList();
            alert(`Christmas Playlist "${name}" loaded! Please note: Local file URLs may have expired.`);
        } else {
            alert("Playlist not found!");
        }
    }

    // Function to delete playlist
    function deletePlaylist() {
        const name = playlistSelect.value;
        if (!name) return;

        if (confirm(`Are you sure you want to delete the Christmas playlist "${name}"?`)) {
            const playlists = JSON.parse(localStorage.getItem(PLAYLIST_STORAGE_KEY) || "{}");
            delete playlists[name];
            localStorage.setItem(PLAYLIST_STORAGE_KEY, JSON.stringify(playlists));
            updatePlaylists();
            alert(`Christmas Playlist "${name}" deleted!`);
        }
    }

    // Update the list of playlists in the dropdown menu
    function updatePlaylists() {
        const playlists = JSON.parse(localStorage.getItem(PLAYLIST_STORAGE_KEY) || "{}");
        const playlistNames = Object.keys(playlists);

        // Clear the list
        playlistSelect.innerHTML = '';

        if (playlistNames.length === 0) {
            const option = document.createElement('option');
            option.textContent = "No saved Christmas playlists";
            playlistSelect.appendChild(option);
        } else {
            playlistNames.forEach(name => {
                const option = document.createElement('option');
                option.value = name;
                option.textContent = name;
                playlistSelect.appendChild(option);
            });
        }
    }

    // Assign handlers for playlist buttons
    savePlaylistBtn.addEventListener('click', savePlaylist);
    loadPlaylistBtn.addEventListener('click', loadPlaylist);
    deletePlaylistBtn.addEventListener('click', deletePlaylist);

    // Player functions
    function playMusic() {
        if (songs.length === 0) {
            alert("Add Christmas music first!");
            return;
        }

        const song = songs[currentSongIndex];
        audio.src = song.url;
        audio.play()
            .then(() => {
                isPlaying = true;
                playBtn.innerHTML = '<i>⏸</i> PAUSE';
                playBtn.classList.add('playing');
            })
            .catch(err => alert("Playback error. This is common with expired local file URLs. Please re-add your carols. Error: " + err.message));
    }

    function stopMusic() {
        audio.pause();
        audio.currentTime = 0;
        isPlaying = false;
        playBtn.innerHTML = '<i>▶️</i> PLAY';
        playBtn.classList.remove('playing');
    }

    function playNext() {
        if (songs.length === 0) return;

        currentSongIndex = (currentSongIndex + 1) % songs.length;
        songList.selectedIndex = currentSongIndex;
        if (isPlaying) playMusic();
    }

    function playPrev() {
        if (songs.length === 0) return;

        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        songList.selectedIndex = currentSongIndex;
        if (isPlaying) playMusic();
    }

    // Color updates for Loop/Shuffle buttons (Theming)
    function toggleLoop() {
        loopMode = !loopMode;
        audio.loop = loopMode;
        loopBtn.innerHTML = loopMode ? '<i>🔁</i> LOOP' : '<i>🔂</i> ONE';
        loopBtn.style.background = loopMode
            ? 'linear-gradient(135deg, #8b0000, #004d00)' // Red/Green
            : 'linear-gradient(135deg, #a03000, #006600)'; // Orange-Red/Dark Green
    }

    function toggleShuffle() {
        isShuffled = !isShuffled;

        if (isShuffled) {
            originalPlaylist = [...songs];
            const currentSong = songs[currentSongIndex];
            songs = songs.filter((_, i) => i !== currentSongIndex);

            // Shuffle
            for (let i = songs.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [songs[i], songs[j]] = [songs[j], songs[i]];
            }

            songs.unshift(currentSong);
            currentSongIndex = 0;
        } else {
            if (originalPlaylist.length > 0) {
                currentSongIndex = originalPlaylist.findIndex(
                    song => song.url === songs[currentSongIndex].url
                );
                songs = [...originalPlaylist];
            }
        }

        shuffleBtn.innerHTML = isShuffled ? '<i>🔀</i> NORMAL' : '<i>🔀</i> SHUFFLE';
        shuffleBtn.style.background = isShuffled
            ? 'linear-gradient(135deg, #a03000, #006600)' // Orange-Red/Dark Green
            : 'linear-gradient(135deg, #8b0000, #004d00)'; // Red/Green

        updateSongList();
    }

    function updateSongList() {
        songList.innerHTML = songs.map((song, i) =>
            `<option value="${i}" ${i === currentSongIndex ? 'selected' : ''}>${song.name}</option>`
        ).join('');
    }

    // Player button handlers
    playBtn.addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
            isPlaying = false;
            playBtn.innerHTML = '<i>▶️</i> PLAY';
            playBtn.classList.remove('playing');
        } else {
            playMusic();
        }
    });

    stopBtn.addEventListener('click', stopMusic);
    nextBtn.addEventListener('click', playNext);
    prevBtn.addEventListener('click', playPrev);
    loopBtn.addEventListener('click', toggleLoop);
    shuffleBtn.addEventListener('click', toggleShuffle);

    // Adding music
    addBtn.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        files.forEach(file => {
            if (file.type.startsWith('audio/')) {
                songs.push({
                    name: file.name.replace('.mp3', ''),
                    url: URL.createObjectURL(file),
                    file: file
                });
            }
        });
        updateSongList();
    });

    songList.addEventListener('change', (e) => {
        currentSongIndex = e.target.selectedIndex;
        if (isPlaying) playMusic();
    });

    // Sound settings
    speedSlider.addEventListener('input', () => {
        audio.playbackRate = speedSlider.value;
        document.getElementById('speed-value').textContent = `${speedSlider.value}x`;
    });

    volumeSlider.addEventListener('input', () => {
        audio.volume = volumeSlider.value;
        document.getElementById('volume-value').textContent = `${Math.round(volumeSlider.value * 100)}%`;
    });

    // Window management (Drag, Collapse, Close) - Unchanged
    let isDragging = false;
    let offsetX, offsetY;

    header.addEventListener('mousedown', (e) => {
        if (e.target.classList.contains('mod-btn-control')) return;

        isDragging = true;
        const rect = modElement.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        modElement.style.transition = 'none';
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        modElement.style.left = `${e.clientX - offsetX}px`;
        modElement.style.top = `${e.clientY - offsetY}px`;
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        modElement.style.transition = 'all 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28)';
    });

    let isCollapsed = false;
    collapseBtn.addEventListener('click', () => {
        isCollapsed = !isCollapsed;
        content.style.display = isCollapsed ? 'none' : 'block';
        collapseBtn.textContent = isCollapsed ? '+' : '−';
    });

    closeBtn.addEventListener('click', () => {
        modElement.style.transform = 'scale(0.8)';
        modElement.style.opacity = '0';
        setTimeout(() => modElement.remove(), 300);
    });

    // Handling end of track
    audio.addEventListener('ended', () => {
        if (loopMode) {
            audio.currentTime = 0;
            audio.play();
        } else {
            playNext();
        }
    });

    // Initialization
    audio.volume = volumeSlider.value;
    audio.playbackRate = speedSlider.value;
    updatePlaylists();
    updateSongList();
})();