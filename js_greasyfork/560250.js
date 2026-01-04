// ==UserScript==
// @name         Goplay Viki Comments (Waterfall)
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Enjoy your Asian dramas with Viki comments displayed as waterfall.
// @author       Niss
// @match        https://goplay.ml/*
// @match        https://goplay.su/*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/560250/Goplay%20Viki%20Comments%20%28Waterfall%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560250/Goplay%20Viki%20Comments%20%28Waterfall%29.meta.js
// ==/UserScript==

/*
MIT License

Copyright (c) 2025 Niss

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.
*/

(function() {
    'use strict';

    let state = {
        currentUrl: window.location.href,
        commentsData: [],
        shownCommentIds: new Set(),
        retryCount: 0,
        fetchInProgress: false,
        mouseTimer: null,
        resizerTimer: null,
        isResizing: false,
        settings: GM_getValue('viki_settings_v9_3', {
            width: 18,
            smartSpoilerSuppression: true,
            isActive: true,
            spoilerKeywords: "spoiler,died,killed",
            bufferBefore: 20,
            bufferAfter: 10
        })
    };

    let checkCommentsInterval;

    const injectStyles = () => {
        $('#viki-ultra-style').remove();
        const width = state.settings.width;

        const css = `
            .jwplayer.jw-viki-active .jw-wrapper {
                width: ${100 - width}% !important;
                transition: ${state.isResizing ? 'none' : 'width 0.2s ease-in-out'};
            }
            #comments-waterfall {
                width: ${width}% !important;
                height: 100% !important;
                position: absolute !important;
                right: 0 !important;
                top: 0 !important;
                background-color: #000000 !important;
                color: #eee !important;
                overflow: hidden !important;
                z-index: 2147483647 !important;
                display: ${state.settings.isActive ? 'flex' : 'none'};
                flex-direction: column;
                border: none !important;
                font-family: sans-serif;
            }

            /* --- RESIZER AREA --- */
            #viki-resizer {
                position: absolute;
                left: 0;
                top: 0;
                width: 18px; /* Slightly wider for better accessibility */
                height: 100%;
                cursor: col-resize;
                z-index: 2147483648;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background 0.3s ease;
                background: transparent;
            }

            /* Gray background feedback when moving mouse */
            #viki-resizer.show-visuals {
                background: rgba(255, 255, 255, 0.15); /* Translucent gray background */
            }

            /* The "Two Lines" indicator */
            #viki-resizer::after {
                content: "";
                width: 4px;
                height: 40px;
                border-left: 1px solid rgba(255,255,255,0.6);
                border-right: 1px solid rgba(255,255,255,0.6);
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            /* Show lines when moving mouse */
            #viki-resizer.show-visuals::after {
                opacity: 1;
            }

            #viki-status-overlay {
                position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
                text-align: center; width: 80%; font-size: 11px; color: #888; z-index: 10;
            }
            .loading-bar-bg { width: 100%; height: 2px; background: #222; margin-top: 8px; border-radius: 2px; overflow: hidden; }
            .loading-bar-fill { width: 0%; height: 100%; background: #3498db; transition: width 0.3s; }

            #viki-tools {
                position: absolute; top: 10px; right: 10px; z-index: 2147483647;
                display: flex; gap: 10px; opacity: 0; transition: opacity 0.2s;
            }
            #comments-waterfall:hover #viki-tools { opacity: 1; }

            #comments-container {
                flex-grow: 1; overflow-y: auto; padding: 20px 10px;
                display: flex; flex-direction: column-reverse; scrollbar-width: none;
            }
            #comments-container::-webkit-scrollbar { display: none; }

            .comment-item {
                background: rgba(255, 255, 255, 0.1); margin-bottom: 8px;
                padding: 10px; border-radius: 4px; font-size: 13px;
            }

            #viki-panel {
                position: absolute; top: 40px; right: 10px; background: #111;
                border: 1px solid #333; padding: 12px; border-radius: 6px;
                display: none; z-index: 2147483649; width: 180px; box-shadow: 0 5px 20px rgba(0,0,0,1);
            }
            .s-row { margin-bottom: 8px; font-size: 11px; }
            .s-label { display: block; margin-bottom: 2px; color: #666; font-size: 9px; }
            .viki-input { width: 100%; background: #1a1a1a; border: 1px solid #333; color: #fff; padding: 4px; border-radius: 3px; font-size: 10px; }
            #v-save-reload { width:100%; padding:6px; cursor:pointer; background:#222; color:#eee; border:1px solid #444; border-radius:3px; font-size: 10px; margin-top: 5px; }

            #viki-restore-btn {
                position: absolute; top: 15px; right: 60px; z-index: 2147483647;
                background: rgba(0,0,0,0.9); color: #eee; padding: 8px 16px;
                border-radius: 20px; cursor: pointer; border: 1px solid #333;
                font-size: 11px; transition: opacity 0.3s; opacity: 0; pointer-events: none;
            }
            #viki-restore-btn.visible { opacity: 1; pointer-events: auto; }
        `;
        $('<style id="viki-ultra-style">').text(css).appendTo('head');

        const player = $('.jwplayer');
        state.settings.isActive ? player.addClass('jw-viki-active') : player.removeClass('jw-viki-active');
    };

    function updateStatus(text, progress) {
        const overlay = $('#viki-status-overlay');
        overlay.find('.status-text').text(text.toUpperCase());
        overlay.find('.loading-bar-fill').css('width', progress + '%');
        if (progress >= 100) {
            setTimeout(() => overlay.fadeOut(500), 1000);
        } else {
            overlay.show();
        }
    }

    function applySmartFilter(rawComments) {
        updateStatus("Shielding Spoilers...", 70);
        if (!state.settings.smartSpoilerSuppression) return rawComments;
        const words = state.settings.spoilerKeywords.split(',').map(k => k.trim()).filter(k => k).join('|');
        if (!words) return rawComments;
        const regex = new RegExp(words, 'i');
        const dangerZones = [];
        rawComments.forEach(c => {
            if (regex.test(c.value)) {
                dangerZones.push({
                    start: c.time - (state.settings.bufferBefore * 1000),
                    end: c.time + (state.settings.bufferAfter * 1000)
                });
            }
        });
        const filtered = rawComments.filter(c => {
            if (regex.test(c.value)) return false;
            return !dangerZones.some(zone => (c.time >= zone.start && c.time <= zone.end));
        });
        updateStatus("Ready", 100);
        return filtered;
    }

    function renderUI() {
        $('#comments-waterfall, #viki-restore-btn').remove();

        const waterfall = $('<div id="comments-waterfall"></div>');
        const resizer = $('<div id="viki-resizer"></div>');
        const statusOverlay = $(`
            <div id="viki-status-overlay">
                <div class="status-text">INITIALIZING...</div>
                <div class="loading-bar-bg"><div class="loading-bar-fill"></div></div>
            </div>
        `);

        const tools = $(`
            <div id="viki-tools">
                <span style="cursor:pointer;" id="v-set">⚙️</span>
                <span style="cursor:pointer;" id="v-cls">❌</span>
            </div>
        `);

        const panel = $(`
            <div id="viki-panel">
                <div class="s-row" style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-size:9px; color:#888;">PRE-FILTER SHIELD</span>
                    <input type="checkbox" id="v-spoiler" ${state.settings.smartSpoilerSuppression ? 'checked' : ''}>
                </div>
                <div class="s-row">
                    <span class="s-label">keywords (comma seperate)</span>
                    <textarea id="v-keywords" class="viki-input" style="height:40px; resize:none;">${state.settings.spoilerKeywords}</textarea>
                </div>
                <div class="s-row"><span class="s-label">Hide x comments before spoilers</span><input type="number" id="v-pre" class="viki-input" value="${state.settings.bufferBefore}"></div>
                <div class="s-row"><span class="s-label">Hide x comments after spoilers</span><input type="number" id="v-post" class="viki-input" value="${state.settings.bufferAfter}"></div>
                <button id="v-save-reload">SAVE & RELOAD</button>
            </div>
        `);

        const container = $('<div id="comments-container"></div>');
        const restoreBtn = $('<div id="viki-restore-btn">💬 Show Comments</div>');

        waterfall.append(resizer, statusOverlay, tools, panel, container);
        $('.jwplayer').append(waterfall, restoreBtn);

        // Show visuals (Gray Background + Lines) only when moving mouse anywhere on waterfall
        waterfall.on('mousemove', function() {
            if (state.settings.isActive) {
                resizer.addClass('show-visuals');
                clearTimeout(state.resizerTimer);
                state.resizerTimer = setTimeout(() => {
                    if (!state.isResizing) resizer.removeClass('show-visuals');
                }, 1500);
            }
        });

        $('#v-set').on('click', () => $('#viki-panel').toggle());
        $('#v-cls').on('click', () => { state.settings.isActive = false; save(); });
        restoreBtn.on('click', () => { state.settings.isActive = true; save(); });

        resizer.on('mousedown', (e) => {
            state.isResizing = true;
            resizer.addClass('show-visuals');
            $('body').css('cursor', 'col-resize');
            e.preventDefault();
        });

        $(document).on('mousemove', (e) => {
            if (!state.isResizing) return;
            const player = $('.jwplayer');
            const playerRect = player[0].getBoundingClientRect();
            const newWidthPx = playerRect.right - e.clientX;
            const newWidthPct = (newWidthPx / playerRect.width) * 100;
            if (newWidthPct > 5 && newWidthPct < 50) {
                state.settings.width = newWidthPct;
                injectStyles();
            }
        });

        $(document).on('mouseup', () => {
            if (state.isResizing) {
                state.isResizing = false;
                $('body').css('cursor', 'default');
                GM_setValue('viki_settings_v9_3', state.settings);
                window.dispatchEvent(new Event('resize'));
            }
        });

        $('.jwplayer').on('mousemove', function() {
            if (!state.settings.isActive) {
                restoreBtn.addClass('visible');
                clearTimeout(state.mouseTimer);
                state.mouseTimer = setTimeout(() => restoreBtn.removeClass('visible'), 2500);
            }
        });

        $('#v-save-reload').on('click', () => {
            state.settings.spoilerKeywords = $('#v-keywords').val();
            state.settings.bufferBefore = parseInt($('#v-pre').val());
            state.settings.bufferAfter = parseInt($('#v-post').val());
            state.settings.smartSpoilerSuppression = $('#v-spoiler').is(':checked');
            GM_setValue('viki_settings_v9_3', state.settings);
            location.reload();
        });
    }

    function save() {
        GM_setValue('viki_settings_v9_3', state.settings);
        injectStyles();
        if (state.settings.isActive) {
            $('#comments-waterfall').show();
            $('#viki-restore-btn').removeClass('visible');
        } else {
            $('#comments-waterfall').hide();
        }
        window.dispatchEvent(new Event('resize'));
    }

    function process() {
        if (!state.settings.isActive || typeof jwplayer !== 'function' || jwplayer().getState() !== 'playing') return;
        const curTime = Math.floor(jwplayer().getPosition() * 1000);
        const container = $('#comments-container');
        state.commentsData.forEach(c => {
            if (Math.abs(c.time - curTime) < 500 && !state.shownCommentIds.has(c.id)) {
                container.prepend(`
                    <div class="comment-item">
                        <div style="font-weight:bold; font-size:12px; margin-bottom:4px; color:#fff;">${c.user.name}</div>
                        <div style="color:#ddd;">${c.value}</div>
                    </div>
                `);
                state.shownCommentIds.add(c.id);
            }
        });
        if (container.children().length > 50) container.children().last().remove();
    }

    function fetch(id) {
        if (state.fetchInProgress) return;
        state.fetchInProgress = true;
        updateStatus("Fetching Viki Comments...", 30);
        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://api.viki.io/v4/videos/${id}/timed_comments/all.json?stream_id=&app=100000a`,
            onload: (res) => {
                state.fetchInProgress = false;
                try {
                    updateStatus("Parsing Data...", 50);
                    state.commentsData = applySmartFilter(JSON.parse(res.responseText));
                    if (checkCommentsInterval) clearInterval(checkCommentsInterval);
                    checkCommentsInterval = setInterval(process, 500);
                } catch(e) { retry(id); }
            },
            onerror: () => retry(id)
        });
    }

    function retry(id) {
        state.fetchInProgress = false;
        if (state.retryCount < 5) {
            state.retryCount++;
            updateStatus(`Retry Connection (${state.retryCount})...`, 10);
            setTimeout(() => fetch(id), 3000);
        } else {
            updateStatus("Failed to load comments", 0);
        }
    }

    function init() {
        const sel = $("img.selectedepisode");
        if (sel.length === 0) return;
        const match = sel.attr('src').match(/\/v\/([^\/]+)/);
        if (match) {
            state.shownCommentIds.clear();
            injectStyles();
            renderUI();
            fetch(match[1]);
        }
    }

    $(window).on('load', () => setTimeout(init, 2000));
    setInterval(() => {
        if (state.currentUrl !== window.location.href) {
            state.currentUrl = window.location.href;
            init();
        }
    }, 3000);
})();