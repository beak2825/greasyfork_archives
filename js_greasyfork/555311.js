// ==UserScript==
// @name         TrixMusic
// @namespace    http://tampermonkey.net/
// @version      1.1.7
// @description  TriX Executor's Music Player.
// @author       Painsel
// @match        *://*/*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://code.jquery.com/ui/1.13.2/jquery-ui.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/howler/2.2.3/howler.min.js
// @resource     JQUERY_UI_CSS https://code.jquery.com/ui/1.13.2/themes/base/jquery-ui.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_info
// @downloadURL https://update.greasyfork.org/scripts/555311/TrixMusic.user.js
// @updateURL https://update.greasyfork.org/scripts/555311/TrixMusic.meta.js
// ==/UserScript==

/*
  Copyright (c) 2025 Painsel
  All Rights Reserved.

  This script is proprietary software. You may not use, copy, modify, merge,
  publish, distribute, sublicense, and/or sell copies of the Software.

  UNAUTHORIZED COPYING, DISTRIBUTION, OR MODIFICATION OF THIS SCRIPT,
  EITHER IN WHOLE OR IN PART, IS STRICTLY PROHIBITED.
*/


(function() {
    'use strict';

    // --- SETTINGS GATEKEEPER ---
    const showOnAllSites = GM_getValue('trixShowOnAllSites', true);

    if (!showOnAllSites) {
        const currentUrl = window.location.href;
        const allowedSites = [
            'https://territorial.io/',
            'https://fxclient.github.io/FXclient/'
        ];
        const isAllowed = allowedSites.some(site => currentUrl.startsWith(site));

        if (!isAllowed) {
            console.log("TrixMusic: Execution stopped. This site is not in the allowed list.");
            return;
        }
    }

    // --- 1. INJECT STYLESHEETS & FONTS ---

    const jqueryUiCss = GM_getResourceText("JQUERY_UI_CSS");
    GM_addStyle(jqueryUiCss);

    const faLink = document.createElement('link');
    faLink.setAttribute('rel', 'stylesheet');
    faLink.setAttribute('href', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css');
    document.head.appendChild(faLink);

    const fontLink = document.createElement('link');
    fontLink.setAttribute('rel', 'stylesheet');
    fontLink.setAttribute('href', 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700');
    document.head.appendChild(fontLink);

    // --- 2. DEFINE HTML AND CSS ---

    const playerHTML = `
        <div class="cont trix-music-container" style="display: none;">
          <div class="player-main">
              <div class="cover">
                <div class="bg"></div>
                <div class="middle">
                  <div class="image">
                    <img src="" id="cover"/>
                  </div>
                  <h1>...</h1>
                  <h2>...</h2>
                </div>
              </div>
              <div class="bar">
                <div class="m_slider"></div>
                <div class="time-display"><span class="current-time">0:00</span> / <span class="total-time">0:00</span></div>
                <div class="buttons">
                  <a class="btn random"><i class="fa fa-random"></i></a>
                  <a class="btn prev"><i class="fa fa-step-backward"></i></a>
                  <a class="btn play"><i class="fa fa-play"></i><i class="fa fa-pause"></i></a>
                  <a class="btn next"><i class="fa fa-step-forward"></i></a>
                  <a class="btn loop active" title="Loop Playlist (Autoplay Next)"><i class="fa fa-refresh"></i></a>
                  <a class="btn volume"><i class="fa fa-volume-up"></i><i class="fa fa-volume-off"></i></a>
                </div>
              </div>
          </div>
          <div class="list-area">
              <ul class="list"></ul>
              <div class="suggestion-box">
                  <p>Have any suggestions? Send a message to Painsel!</p>
                  <a href="https://form.jotform.com/253124626389563" class="suggestion-btn" target="_blank" rel="noopener noreferrer">Add a Song</a>
                  <div class="settings-area">
                      <label>
                          <input type="checkbox" id="trix-show-on-all-sites">
                          Show on All Websites
                      </label>
                  </div>
                  <div id="trixmusic-version" class="version-footer"></div>
                  <div id="trixmusic-update-footer" class="update-footer" style="display: none;">
                      <span>New Version available. Update now?</span>
                      <a href="https://update.greasyfork.org/scripts/555311/TrixMusic.user.js" class="update-footer-btn" target="_blank">Update</a>
                  </div>
              </div>
          </div>
        </div>
        <button id="trixmusic-toggle-button">Toggle TrixMusic</button>
    `;

    const playerCSS = `
        #trixmusic-toggle-button {
            position: fixed; bottom: 15px; right: 15px; z-index: 99998;
            padding: 10px 15px; background-color: #FE186B; color: white;
            border: none; border-radius: 5px; cursor: move; font-family: 'Roboto', sans-serif;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }
        .trix-music-container * { position: relative; cursor: default; box-sizing: border-box; }
        .trix-music-container {
            position: fixed; background: #fff; width: 950px; height: 500px;
            box-shadow: 0px 0px 50px #aaa; font-family: 'Roboto', sans-serif;
            z-index: 99999; cursor: grab; display: flex; overflow: hidden;
        }
        .trix-music-container:active { cursor: grabbing; }

        /* Main Player Area (Left Side) */
        .player-main { width: 550px; height: 100%; display: flex; flex-direction: column; }
        .player-main .cover { flex-grow: 1; background: #000; overflow: hidden; transition: 0.5s; z-index: 10; }
        .player-main .cover .bg {
            width: 100%; height: 100%; opacity: 0.5;
            filter: blur(10px); transform: scale(1.2); z-index: 10;
            background-size: cover; background-position: center;
        }
        .player-main .cover .middle {
            position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);
            text-align: center; color: #fff; transition: 0.5s; z-index: 30; width: 100%;
        }
        .player-main .cover .middle .image { width: 200px; height: 200px; overflow: hidden; border-radius: 50%; margin: 0 auto; }
        .player-main .cover .middle .image img { display: block; width: 100%; }
        .player-main .cover .middle h1 { font-size: 20px; padding: 10px 0; }
        .player-main .cover .middle h2 { font-size: 12px; opacity: 0.5; }

        /* Bar */
        .player-main .bar {
            width: 100%; height: 100px; position: relative; bottom: 0; left: 0;
            text-align: center; transition: 0.5s; z-index: 20; color: #fff; background: #000;
        }
        .player-main .bar .m_slider { background: #555; width: 100%; height: 5px; cursor: pointer;}
        .player-main .bar .m_slider .ui-slider-range { height: 100%; background: #FE186B; }
        .player-main .bar .m_slider .ui-slider-handle {
            width: 15px; height: 15px; top: -5px; margin-left: -8px;
            border-radius: 50%; display: block; background: #FFF; border: none;
        }
        .player-main .bar .buttons { width: 100%; top: 20px; }
        .player-main .bar .btn {
            display: inline-block; width: 30px; height: 30px; text-align: center;
            overflow: hidden; vertical-align: middle; margin: 0px 5px;
            transition: 0.5s; cursor: pointer; color: #fff;
        }
        .player-main .bar .btn:hover { color: #FE186B; }
        .player-main .bar .btn.toggle i { top: -30px; }
        .player-main .bar .btn i { display: block; line-height: 30px; top: 0px; transition: 0.5s; pointer-events: none; }
        .player-main .bar .btn.play { width: 50px; height: 50px; font-size: 30px; margin: 0 8px; }
        .player-main .bar .btn.play i { line-height: 50px; }
        .player-main .bar .btn.play.toggle i { top: -50px; }
        .player-main .bar .btn.random { position: absolute; left: 20px; top: 10px; }
        .player-main .bar .btn.volume { position: absolute; right: 20px; top: 10px; }
        .player-main .bar .btn.loop { position: absolute; right: 60px; top: 10px; opacity: 0.3; }
        .player-main .bar .btn.loop.active { opacity: 1; }
        .player-main .bar .btn.loop i.fa-repeat { font-size: 1.1em; }
        .player-main .bar .time-display {
            position: absolute; top: 10px; left: 50%; transform: translateX(-50%);
            font-size: 12px; color: white; opacity: 0.7;
        }

        /* List Area & Suggestion Box (Right Side) */
        .list-area {
            position: relative; width: 400px; height: 100%; z-index: 20;
            padding: 10px; box-sizing: border-box; display: flex; flex-direction: column; background: #f7f7f7;
        }
        .list { list-style: none; flex-grow: 1; overflow-y: auto; margin: 0; padding: 0; }
        .list li { background: rgba(255, 255, 255, 0.9); width: 100%; margin-top: 10px; transition: background 0.5s; cursor: pointer; }
        .list li * { pointer-events: none; }
        .list li .text { height: 50px; display: inline-block; width: calc(100% - 55px); padding: 5px 10px; overflow: hidden; }
        .list li .text p { font-size: 16px; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #333; }
        .list li .text p + p { font-size: 12px; opacity: 0.6; }
        .list li.playing { color: #FE186B; background: #fff; box-shadow: 0 0 5px rgba(254, 24, 107, 0.5); }
        .list li.playing .pl { opacity: 1; }
        .list li:hover { background: #eee; }
        .list li .pl { transition: 0.5s; position: absolute; right: 10px; top: 0; line-height: 50px; opacity: 0; }
        .list li img { height: 50px; vertical-align: top; display: inline-block; }
        .suggestion-box {
            padding: 15px 10px 5px 10px; text-align: center; flex-shrink: 0;
            border-top: 1px solid #eee; margin-top: 10px;
        }
        .suggestion-box p { font-size: 12px; color: #666; margin: 0 0 10px 0; }
        .suggestion-btn {
            display: inline-block; padding: 8px 15px; background-color: #FE186B;
            color: #fff !important; text-decoration: none; border-radius: 5px;
            font-size: 13px; font-weight: 500; transition: background-color 0.2s ease; cursor: pointer;
        }
        .suggestion-btn:hover { background-color: #d11458; }
        .settings-area { margin-top: 15px; font-size: 12px; color: #555; }
        .settings-area input { vertical-align: middle; margin-right: 5px; }
        .version-footer { font-size: 11px; color: #aaa; margin-top: 8px; }
        .update-footer {
            font-size: 11px; color: #c0392b; margin-top: 8px; padding: 5px;
            background-color: #f9e3e3; border-radius: 4px; display: flex;
            justify-content: space-between; align-items: center;
        }
        .update-footer-btn {
            text-decoration: none; background-color: #27ae60; color: #fff !important;
            padding: 3px 8px; border-radius: 4px; font-size: 11px;
            margin-left: 10px; cursor: pointer;
        }
        .update-footer-btn:hover { background-color: #2ecc71; }
    `;

    // --- UPDATE CHECKER LOGIC ---
    const updateModalCSS = `
        .trix-update-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.7); z-index: 100000; display: flex;
            align-items: center; justify-content: center;
        }
        .trix-update-modal {
            background: #fff; padding: 25px; border-radius: 8px; text-align: center;
            max-width: 400px; font-family: 'Roboto', sans-serif;
        }
        .trix-update-modal h2 { margin-top: 0; color: #c0392b; }
        .trix-update-modal p { margin-bottom: 20px; color: #333; }
        .trix-update-modal .modal-buttons button {
            padding: 10px 20px; border: none; border-radius: 5px;
            cursor: pointer; font-size: 14px; margin: 0 10px;
        }
        .trix-update-modal .update-btn { background-color: #27ae60; color: white; }
        .trix-update-modal .later-btn { background-color: #7f8c8d; color: white; }
    `;

    const updateModalHTML = (updateURL) => `
        <div class="trix-update-overlay">
            <div class="trix-update-modal">
                <h2>OUTDATED VERSION</h2>
                <p>You are using an outdated version of TrixMusic. Please update for the best experience!</p>
                <div class="modal-buttons">
                    <button class="update-btn" onclick="window.open('${updateURL}', '_blank');">Update now!</button>
                    <button class="later-btn">Remind me later!</button>
                </div>
            </div>
        </div>
    `;

    function showUpdateNotification(updateURL) {
        GM_addStyle(updateModalCSS);
        const modalElement = document.createElement('div');
        modalElement.innerHTML = updateModalHTML(updateURL);
        document.body.appendChild(modalElement);

        modalElement.querySelector('.later-btn').addEventListener('click', () => modalElement.remove());
        modalElement.querySelector('.update-btn').addEventListener('click', () => modalElement.remove());
        $('#trixmusic-update-footer').show();
    }

    function checkForUpdates() {
        const currentVersion = GM_info.script.version;
        const updateURL = 'https://update.greasyfork.org/scripts/555311/TrixMusic.user.js';

        GM_xmlhttpRequest({
            method: 'GET',
            url: updateURL,
            onload: function(response) {
                const match = response.responseText.match(/@version\s+([\d.]+)/);
                if (match) {
                    const latestVersion = match[1];
                    if (latestVersion > currentVersion) {
                        showUpdateNotification(updateURL);
                    }
                }
            }
        });
    }

    // --- 3. INJECT HTML & SCRIPT LOGIC ---

    document.body.insertAdjacentHTML('beforeend', playerHTML);
    GM_addStyle(playerCSS);

    $(function() {
        // --- Player State and Data ---
        const player = {
            tracklist: [
                {
                    title: 'Passo Bem Solto',
                    artist: 'ATLXS',
                    cover: 'https://upload.wikimedia.org/wikipedia/en/thumb/3/34/Passo_Bem_Solto_-_Atlxs.jpg/250px-Passo_Bem_Solto_-_Atlxs.jpg',
                    file: 'https://evzxirgylircpnblikrw.supabase.co/storage/v1/object/public/MOOZIK/ATLXS_-_PASSO_BEM_SOLTO_-_Slowed_@BaseNaija%20(2).mp3'
                },
                {
                    title: 'Honeypie',
                    artist: 'JAWNY',
                    cover: 'https://i1.sndcdn.com/artworks-8JDT4NmXVBHXwi02-5YRUCA-t500x500.jpg',
                    file: 'https://evzxirgylircpnblikrw.supabase.co/storage/v1/object/public/MOOZIK/JAWNY_-_Honeypie_muzonov.net_(mp3.pm).mp3'
                },
                {
                    title: 'It Has To Be This Way',
                    artist: 'Jamie Christopherson & Logan Mader',
                    cover: 'https://i1.sndcdn.com/artworks-000072742433-j335oj-t500x500.jpg',
                    file: 'https://evzxirgylircpnblikrw.supabase.co/storage/v1/object/public/MOOZIK/Metal%20Gear%20Rising-%20Revengeance%20OST%20-%20It%20Has%20To%20Be%20This%20Way%20_Senator%20Battle_%20-%20Jamie%20Christopherson%20-%20SoundLoadMate.com.mp3'
                },
                {
                    title: 'D.D.D.D',
                    artist: '(K)NoW_NAME',
                    cover: 'https://i.scdn.co/image/ab67616d0000b2731b0339f042d798da979c898f',
                    file: 'https://evzxirgylircpnblikrw.supabase.co/storage/v1/object/public/MOOZIK/D.D.D.D..mp3'
                }
            ],
            currentIndex: 0,
            currentSound: null,
            isPlaying: false,
            loopMode: 1, // 0 = off, 1 = loop playlist (autoplay next), 2 = loop single
            isRandom: false,
            isMuted: false
        };

        // --- Core Functions ---
        const loadTrack = (index, shouldPlay) => {
            if (player.currentSound) player.currentSound.unload();
            const track = player.tracklist[index];
            player.currentIndex = index;

            $('.cover .image img').attr('src', track.cover);
            $('.cover .bg').css('background-image', 'url(' + track.cover + ')');
            $('.cover h1').text(track.title);
            $('.cover h2').text(track.artist);
            $('.list li').removeClass('playing');
            $(`.list li#track-${index}`).addClass('playing');

            player.currentSound = new Howl({
                src: [track.file],
                html5: true,
                volume: player.isMuted ? 0 : 1,
                loop: player.loopMode === 2,
                onplay: () => {
                    player.isPlaying = true;
                    $('.play').addClass('toggle');
                    requestAnimationFrame(step);
                },
                onpause: () => {
                    player.isPlaying = false;
                    $('.play').removeClass('toggle');
                },
                onend: () => {
                    if (player.loopMode === 1) {
                        nextTrack();
                    } else if (player.loopMode === 0) {
                        if (!player.isRandom && player.currentIndex < player.tracklist.length - 1) {
                            nextTrack();
                        } else if (player.isRandom) {
                            nextTrack();
                        } else {
                            player.isPlaying = false;
                            $('.play').removeClass('toggle');
                        }
                    }
                },
                onload: () => {
                    updateTimeDisplay();
                    if (shouldPlay) playTrack();
                }
            });
        };

        const playTrack = () => { if (player.currentSound && !player.currentSound.playing()) player.currentSound.play(); };
        const pauseTrack = () => { if (player.currentSound && player.currentSound.playing()) player.currentSound.pause(); };

        const nextTrack = () => {
            let nextIndex;
            if (player.isRandom) {
                do { nextIndex = Math.floor(Math.random() * player.tracklist.length); } while (nextIndex === player.currentIndex && player.tracklist.length > 1);
            } else { nextIndex = (player.currentIndex + 1) % player.tracklist.length; }
            loadTrack(nextIndex, true);
        };

        const prevTrack = () => {
            const prevIndex = (player.currentIndex - 1 + player.tracklist.length) % player.tracklist.length;
            loadTrack(prevIndex, true);
        };

        const seek = (value) => {
            if (player.currentSound && player.currentSound.state() === 'loaded') {
                player.currentSound.seek(player.currentSound.duration() * (value / 100));
            }
        };

        // --- UI Update Functions ---
        const formatTime = (secs) => {
            const minutes = Math.floor(secs / 60) || 0;
            const seconds = Math.floor(secs - minutes * 60) || 0;
            return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
        };

        const updateTimeDisplay = () => {
            if (!player.currentSound) return;
            const duration = player.currentSound.duration() || 0;
            const seekPos = player.currentSound.seek() || 0;
            $('.current-time').text(formatTime(seekPos));
            $('.total-time').text(formatTime(duration));
        };

        const step = () => {
            if (player.currentSound && player.currentSound.playing()) {
                const seekPos = player.currentSound.seek() || 0;
                const duration = player.currentSound.duration() || 0;
                if (duration) $('.m_slider').slider('value', (seekPos / duration) * 100);
                updateTimeDisplay();
                requestAnimationFrame(step);
            }
        };

        // --- Initialization ---
        const container = $('.trix-music-container');
        container.css({
            top: ($(window).height() - container.outerHeight()) / 2 + 'px',
            left: ($(window).width() - container.outerWidth()) / 2 + 'px'
        });

        $('#trixmusic-version').text('v' + GM_info.script.version);

        $.each(player.tracklist, (i, track) => {
            $('.list').append(
                `<li id="track-${i}">
                    <img src="${track.cover}"/>
                    <div class="text"><p>${track.title}</p><p>${track.artist}</p></div>
                    <i class="fa fa-music pl"></i>
                </li>`
            );
        });

        $(".m_slider").slider({
            range: "min", value: 0, min: 0, max: 100,
            slide: (event, ui) => {
                const newTime = player.currentSound.duration() * (ui.value / 100);
                $('.current-time').text(formatTime(newTime));
            },
            stop: (event, ui) => {
                seek(ui.value);
            }
        });
        loadTrack(0, false);

        // --- Event Handlers ---
        $('.play').on('click', () => (player.currentSound.playing()) ? pauseTrack() : playTrack());
        $('.next').on('click', nextTrack);
        $('.prev').on('click', prevTrack);

        $('.volume').on('click', function() {
            $(this).toggleClass('toggle');
            player.isMuted = $(this).hasClass('toggle');
            Howler.volume(player.isMuted ? 0 : 1);
        });

        $('.loop').on('click', function() {
            player.loopMode = (player.loopMode + 1) % 3;
            const icon = $(this).find('i');
            icon.removeClass('fa-refresh fa-repeat');

            if (player.loopMode === 1) { // Loop Playlist
                $(this).addClass('active').attr('title', 'Loop Playlist (Autoplay Next)');
                icon.addClass('fa-refresh');
            } else if (player.loopMode === 2) { // Loop Single
                $(this).addClass('active').attr('title', 'Loop Single Song');
                icon.addClass('fa-repeat');
            } else { // Loop Off
                $(this).removeClass('active').attr('title', 'Loop Off');
                icon.addClass('fa-refresh');
            }
            if (player.currentSound) player.currentSound.loop(player.loopMode === 2);
        });

        $('.random').on('click', function() { $(this).toggleClass('active'); player.isRandom = $(this).hasClass('active'); });

        $('.list').on('click', 'li', function() {
            if ($(this).data('isSorting')) return;
            loadTrack(parseInt($(this).attr('id').replace('track-', '')), true);
        });

        // --- Settings Handler ---
        const settingsCheckbox = $('#trix-show-on-all-sites');
        settingsCheckbox.prop('checked', GM_getValue('trixShowOnAllSites', true));
        settingsCheckbox.on('change', function() {
            GM_setValue('trixShowOnAllSites', $(this).prop('checked'));
            alert('TrixMusic settings saved. Please reload the page for changes to take full effect.');
        });

        // --- Draggable Logic ---
        container.draggable({ handle: ".player-main", containment: "window" });
        $('.list').sortable({
            revert: true,
            items: "> li",
            start: function(event, ui) { ui.item.data('isSorting', true); },
            stop: function(event, ui) { setTimeout(() => { ui.item.data('isSorting', false); }, 100); }
        }).disableSelection();

        $('#trixmusic-toggle-button').draggable({
            containment: "window",
            start: function() { $(this).data('isDragging', true); },
            stop: function() { setTimeout(() => { $(this).data('isDragging', false); }, 100); }
        }).on('click', function() {
            if (!$(this).data('isDragging')) { container.toggle(); }
        });

        // --- INITIATE UPDATE CHECK ---
        checkForUpdates();
    });
})();