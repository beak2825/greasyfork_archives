// ==UserScript==
// @name         Twitch Offchat Stream Viewer
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Watch another stream while chilling in an offline chat
// @author       benno2503
// @match        https://www.twitch.tv/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557031/Twitch%20Offchat%20Stream%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/557031/Twitch%20Offchat%20Stream%20Viewer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
        #offchat-embed-wrapper {
            box-sizing: border-box !important;
        }
        #offchat-embed-wrapper iframe,
        #offchat-twitch-iframe {
            box-sizing: border-box !important;
            border: none !important;
        }
    `;
    document.head.appendChild(style);

    const IGNORED_PATHS = [
        'directory', 'following', 'settings', 'subscriptions',
        'inventory', 'wallet', 'drops', 'videos', 'p', 'search',
        'downloads', 'turbo', 'jobs', 'about', 'prime', 'bits'
    ];

    let config = { lastStreams: GM_getValue('lastStreams', []) };
    let currentChannel = '';
    let controlPanel = null;
    let chatControlPanel = null;
    let openChats = []; // Array of { channel, window, minimizeButton, isMinimized, chatMode, settingsIcon, overlays, resizeHandle }
    let openStreams = []; // Array of { id, type: 'twitch'|'youtube', displayName }
    let focusedStreamIndex = null; // Index of focused stream in spotlight mode
    let streamContainer = null; // Container for all streams
    let currentPanelMode = 'stream'; // 'stream' or 'chat'
    let lastChannel = null;
    let buttonCheckInterval = null;
    let streamWrapperCache = {}; // Cache stream wrappers (including iframes) to prevent reloading
    let resizeUpdateBound = null; // Bound resize update function to prevent duplicates
    let isTheaterMode = false; // Theater mode state
    let theaterModeStyle = null; // Style element for theater mode
    let isMuted = false; // Global mute state for sync mute
    let isMainStreamHidden = false; // Hide main Twitch stream state

    function isChannelPage() {
        const path = window.location.pathname.split('/')[1]?.toLowerCase();
        if (!path) return false;
        if (IGNORED_PATHS.includes(path)) return false;
        return /^[a-z0-9_]+$/.test(path);
    }

    function getCurrentChannel() {
        const path = window.location.pathname.split('/')[1];
        if (path && isChannelPage()) return path.toLowerCase();
        return null;
    }

    function extractChannelName(input) {
        if (!input) return null;
        input = input.trim();
        const urlMatch = input.match(/twitch\.tv\/([a-zA-Z0-9_]+)/);
        if (urlMatch) return urlMatch[1].toLowerCase();
        return input.toLowerCase().replace(/[^a-z0-9_]/g, '');
    }

    function extractYouTubeVideoId(input) {
        if (!input) return null;
        input = input.trim();

        // Match various YouTube URL formats
        const patterns = [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
            /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
            /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/
        ];

        for (const pattern of patterns) {
            const match = input.match(pattern);
            if (match) return match[1];
        }

        // If it looks like a video ID (11 chars), return it
        if (/^[a-zA-Z0-9_-]{11}$/.test(input)) {
            return input;
        }

        return null;
    }

    function isYouTubeUrl(input) {
        return input && (input.includes('youtube.com') || input.includes('youtu.be'));
    }

    function makeDraggable(element, handle) {
        let isDragging = false;
        let startX, startY, startLeft, startTop;

        handle.style.cursor = 'grab';

        handle.addEventListener('mousedown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') return;
            isDragging = true;
            handle.style.cursor = 'grabbing';
            startX = e.clientX;
            startY = e.clientY;
            const rect = element.getBoundingClientRect();
            startLeft = rect.left;
            startTop = rect.top;
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            element.style.left = (startLeft + dx) + 'px';
            element.style.top = (startTop + dy) + 'px';
            element.style.right = 'auto';
            element.style.bottom = 'auto';
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            handle.style.cursor = 'grab';
        });
    }

    async function createEmbedPlayer(input) {
        if (!input) return;

        let streamData;

        // Check if it's a YouTube URL
        if (isYouTubeUrl(input)) {
            const videoId = extractYouTubeVideoId(input);
            if (!videoId) {
                alert("Invalid YouTube URL!");
                return;
            }

            // Check if already open
            if (openStreams.some(s => s.id === videoId && s.type === 'youtube')) {
                alert("This YouTube video is already open!");
                return;
            }

            // Fetch video title
            let displayName = `YT: ${videoId.substring(0, 8)}...`;
            try {
                const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
                if (response.ok) {
                    const data = await response.json();
                    displayName = data.title || displayName;
                }
            } catch (e) {
                console.log('Could not fetch YouTube title:', e);
            }

            streamData = {
                id: videoId,
                type: 'youtube',
                displayName: displayName
            };
        } else {
            // Twitch channel
            const channel = extractChannelName(input);
            if (!channel) return;

            // Check if already open
            if (openStreams.some(s => s.id === channel && s.type === 'twitch')) {
                alert("This stream is already open!");
                return;
            }

            streamData = {
                id: channel,
                type: 'twitch',
                displayName: channel
            };
        }

        // Limit to 4 streams
        if (openStreams.length >= 4) {
            alert("Maximum 4 streams allowed!");
            return;
        }

        // Save to recent (only Twitch channels)
        if (streamData.type === 'twitch') {
            config.lastStreams = config.lastStreams.filter(s => s !== streamData.id);
            config.lastStreams.unshift(streamData.id);
            if (config.lastStreams.length > 10) config.lastStreams.pop();
            GM_setValue('lastStreams', config.lastStreams);
        }

        openStreams.push(streamData);
        renderStreamContainer();
        updateControlPanel();

        // Apply current mute state to newly added stream
        if (isMuted) {
            setTimeout(() => {
                const streamKey = `${streamData.type}-${streamData.id}`;
                const wrapper = streamWrapperCache[streamKey];
                if (wrapper) {
                    const iframe = wrapper.querySelector('iframe');
                    if (iframe && iframe.contentWindow) {
                        if (streamData.type === 'twitch') {
                            try {
                                iframe.contentWindow.postMessage(
                                    JSON.stringify({
                                        namespace: 'twitch-embed-player-proxy',
                                        method: 'setMuted',
                                        arguments: [true]
                                    }),
                                    'https://player.twitch.tv'
                                );
                            } catch (e) {
                                console.log('[Offchat] Failed to mute new Twitch stream:', e);
                            }
                        } else if (streamData.type === 'youtube') {
                            try {
                                iframe.contentWindow.postMessage(
                                    JSON.stringify({
                                        event: 'command',
                                        func: 'mute',
                                        args: []
                                    }),
                                    'https://www.youtube.com'
                                );
                            } catch (e) {
                                console.log('[Offchat] Failed to mute new YouTube stream:', e);
                            }
                        }
                    }
                }
            }, 1000); // Wait 1 second for iframe to load
        }
    }

    function removeStream(streamId, streamType) {
        const index = openStreams.findIndex(s => s.id === streamId && s.type === streamType);
        if (index === -1) return;

        // Remove from cache
        const streamKey = `${streamType}-${streamId}`;
        const wrapper = streamWrapperCache[streamKey];
        if (wrapper && wrapper.parentNode) {
            wrapper.remove();
        }
        delete streamWrapperCache[streamKey];

        openStreams.splice(index, 1);

        // Reset focus if we removed the focused stream
        if (focusedStreamIndex === index) {
            focusedStreamIndex = null;
        } else if (focusedStreamIndex !== null && focusedStreamIndex > index) {
            focusedStreamIndex--;
        }

        if (openStreams.length === 0) {
            removeStreamContainer();
        } else {
            renderStreamContainer();
        }
        updateControlPanel();
    }

    function removeStreamContainer() {
        if (streamContainer) {
            streamContainer.remove();
            streamContainer = null;
        }
        if (resizeUpdateBound) {
            window.removeEventListener('resize', resizeUpdateBound);
            window.removeEventListener('scroll', resizeUpdateBound);
            resizeUpdateBound = null;
        }
        openStreams = [];
        focusedStreamIndex = null;
        streamWrapperCache = {}; // Clear wrapper cache
    }

    function toggleStreamFocus(index) {
        if (focusedStreamIndex === index) {
            focusedStreamIndex = null; // Return to grid
        } else {
            focusedStreamIndex = index; // Spotlight this stream
        }
        renderStreamContainer();
    }

    function renderStreamContainer() {
        if (openStreams.length === 0) {
            removeStreamContainer();
            return;
        }

        const numStreams = openStreams.length;
        const containerPadding = numStreams === 1 ? '0px' : '8px';

        let containerRect;
        let playerContainer = null;

        // In theater mode, use full viewport
        if (isTheaterMode) {
            containerRect = {
                top: 0,
                left: 0,
                width: window.innerWidth,
                height: window.innerHeight
            };
        } else {
            // Normal mode: position over player container
            playerContainer = document.querySelector('[data-a-target="video-player"]') ||
                             document.querySelector('.video-player__container') ||
                             document.querySelector('.video-player') ||
                             document.querySelector('.persistent-player');

            if (playerContainer) {
                containerRect = playerContainer.getBoundingClientRect();
            } else {
                const chatWidth = 340;
                const navHeight = 50;
                containerRect = {
                    top: navHeight,
                    left: 0,
                    width: window.innerWidth - chatWidth,
                    height: window.innerHeight - navHeight
                };
            }
        }

        // Check if container exists
        let existing = document.getElementById('offchat-embed-wrapper');

        if (!existing) {
            // Create new container only if it doesn't exist
            streamContainer = document.createElement('div');
            streamContainer.id = 'offchat-embed-wrapper';

            // Always use containerRect for positioning (works in both modes)
            streamContainer.style.cssText = `
                position: fixed !important;
                top: ${containerRect.top}px !important;
                left: ${containerRect.left}px !important;
                width: ${containerRect.width}px !important;
                height: ${containerRect.height}px !important;
                z-index: 1000 !important;
                background: #0e0e10 !important;
                overflow: hidden !important;
                box-sizing: border-box !important;
                display: block !important;
                padding: ${containerPadding} !important;
                gap: 8px !important;
            `;

            document.body.appendChild(streamContainer);
        } else {
            // Update existing container styling
            streamContainer = existing;
            streamContainer.style.padding = containerPadding;

            // Always update position (theater mode or normal)
            streamContainer.style.top = containerRect.top + 'px';
            streamContainer.style.left = containerRect.left + 'px';
            streamContainer.style.width = containerRect.width + 'px';
            streamContainer.style.height = containerRect.height + 'px';
        }

        // Calculate layout based on number of streams and focus mode
        const isSpotlight = focusedStreamIndex !== null;

        // Track which stream keys are currently active
        const activeStreamKeys = new Set();

        openStreams.forEach((stream, index) => {
            const streamKey = `${stream.type}-${stream.id}`;
            activeStreamKeys.add(streamKey);

            // Check if wrapper already exists in cache
            let streamWrapper = streamWrapperCache[streamKey];

            if (!streamWrapper) {
                // Create new wrapper and iframe
                streamWrapper = document.createElement('div');
                streamWrapper.className = 'offchat-stream-wrapper';
                streamWrapper.dataset.streamKey = streamKey;

                const iframe = document.createElement('iframe');

                // Set iframe source based on stream type
                if (stream.type === 'youtube') {
                    iframe.src = `https://www.youtube.com/embed/${stream.id}?autoplay=1&mute=0&rel=0&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}`;
                } else {
                    iframe.src = `https://player.twitch.tv/?channel=${stream.id}&parent=www.twitch.tv&muted=false&autoplay=true`;
                }

                iframe.setAttribute('allowfullscreen', 'true');
                iframe.setAttribute('allow', 'autoplay; fullscreen');

                iframe.style.width = '100%';
                iframe.style.height = '100%';
                iframe.style.border = 'none';

                streamWrapper.appendChild(iframe);
                streamWrapperCache[streamKey] = streamWrapper;

                // Append to container immediately after creation
                streamContainer.appendChild(streamWrapper);
            }

            // Update wrapper position and styling using individual properties
            const styleProps = getStreamWrapperStyleProps(index, numStreams, isSpotlight, containerRect);

            streamWrapper.style.position = styleProps.position;
            streamWrapper.style.top = styleProps.top;
            streamWrapper.style.left = styleProps.left;
            streamWrapper.style.width = styleProps.width;
            streamWrapper.style.height = styleProps.height;
            streamWrapper.style.border = styleProps.border;
            streamWrapper.style.borderRadius = styleProps.borderRadius;
            streamWrapper.style.boxSizing = styleProps.boxSizing;
            streamWrapper.style.overflow = styleProps.overflow;
            streamWrapper.style.transition = styleProps.transition;
            streamWrapper.style.zIndex = styleProps.zIndex || '1';
            streamWrapper.style.cursor = 'pointer';

            streamWrapper.onclick = () => toggleStreamFocus(index);

            // Update iframe border radius only
            const iframe = streamWrapper.querySelector('iframe');
            if (iframe) {
                iframe.style.borderRadius = numStreams === 1 ? '0' : '8px';
            }
        });

        // Remove any wrappers that are no longer needed
        Object.keys(streamWrapperCache).forEach(key => {
            if (!activeStreamKeys.has(key)) {
                const wrapper = streamWrapperCache[key];
                if (wrapper.parentNode) {
                    wrapper.remove();
                }
                delete streamWrapperCache[key];
            }
        });

        // Update on resize - only add listeners once
        if (!resizeUpdateBound) {
            resizeUpdateBound = () => {
                if (!streamContainer) return;

                let rect;

                // In theater mode, use full viewport
                if (isTheaterMode) {
                    rect = {
                        top: 0,
                        left: 0,
                        width: window.innerWidth,
                        height: window.innerHeight
                    };
                } else {
                    // Normal mode: use player container
                    const playerContainer = document.querySelector('[data-a-target="video-player"]') ||
                                           document.querySelector('.video-player__container') ||
                                           document.querySelector('.video-player') ||
                                           document.querySelector('.persistent-player');

                    if (playerContainer) {
                        rect = playerContainer.getBoundingClientRect();
                    } else {
                        return; // No player container found
                    }
                }

                streamContainer.style.top = rect.top + 'px';
                streamContainer.style.left = rect.left + 'px';
                streamContainer.style.width = rect.width + 'px';
                streamContainer.style.height = rect.height + 'px';

                const numStreams = openStreams.length;
                const isSpotlight = focusedStreamIndex !== null;

                // Re-calculate stream positions
                openStreams.forEach((stream, index) => {
                    const streamKey = `${stream.type}-${stream.id}`;
                    const wrapper = streamWrapperCache[streamKey];
                    if (wrapper) {
                        const styleProps = getStreamWrapperStyleProps(index, numStreams, isSpotlight, rect);
                        wrapper.style.position = styleProps.position;
                        wrapper.style.top = styleProps.top;
                        wrapper.style.left = styleProps.left;
                        wrapper.style.width = styleProps.width;
                        wrapper.style.height = styleProps.height;
                        wrapper.style.border = styleProps.border;
                        wrapper.style.borderRadius = styleProps.borderRadius;
                        wrapper.onclick = () => toggleStreamFocus(index);
                        wrapper.style.cursor = 'pointer';
                    }
                });
            };
            window.addEventListener('resize', resizeUpdateBound);
            window.addEventListener('scroll', resizeUpdateBound);
        }
    }

    function getStreamWrapperStyleProps(index, numStreams, isSpotlight, containerRect) {
        const padding = 8;
        const gap = 8;
        const borderWidth = 3;
        const availableWidth = containerRect.width - (padding * 2);
        const availableHeight = containerRect.height - (padding * 2);

        if (isSpotlight) {
            // Spotlight mode: one large, others as thumbnails in corner
            if (index === focusedStreamIndex) {
                // Large focused stream
                return {
                    position: 'absolute',
                    top: padding + 'px',
                    left: padding + 'px',
                    width: availableWidth + 'px',
                    height: availableHeight + 'px',
                    border: borderWidth + 'px solid #9147ff',
                    borderRadius: '12px',
                    boxSizing: 'border-box',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease'
                };
            } else {
                // Small thumbnail streams
                const thumbnailWidth = 200;
                const thumbnailHeight = 113; // 16:9 ratio
                const thumbnailIndex = index > focusedStreamIndex ? index - 1 : index;
                const thumbnailX = padding + gap;
                const thumbnailY = padding + gap + (thumbnailIndex * (thumbnailHeight + gap));

                return {
                    position: 'absolute',
                    top: thumbnailY + 'px',
                    left: thumbnailX + 'px',
                    width: thumbnailWidth + 'px',
                    height: thumbnailHeight + 'px',
                    border: borderWidth + 'px solid #bf94ff',
                    borderRadius: '8px',
                    boxSizing: 'border-box',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    zIndex: '10'
                };
            }
        } else {
            // Grid mode
            if (numStreams === 1) {
                // Single stream - no border, fill completely
                return {
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    width: containerRect.width + 'px',
                    height: containerRect.height + 'px',
                    border: 'none',
                    borderRadius: '0',
                    boxSizing: 'border-box',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease'
                };
            } else if (numStreams === 2) {
                // Top/bottom layout
                const streamHeight = (availableHeight - gap) / 2;
                const top = index === 0 ? padding : padding + streamHeight + gap;

                return {
                    position: 'absolute',
                    top: top + 'px',
                    left: padding + 'px',
                    width: availableWidth + 'px',
                    height: streamHeight + 'px',
                    border: borderWidth + 'px solid #9147ff',
                    borderRadius: '12px',
                    boxSizing: 'border-box',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease'
                };
            } else {
                // 2x2 grid for 3-4 streams
                const streamWidth = (availableWidth - gap) / 2;
                const streamHeight = (availableHeight - gap) / 2;
                const col = index % 2;
                const row = Math.floor(index / 2);
                const left = padding + (col * (streamWidth + gap));
                const top = padding + (row * (streamHeight + gap));

                return {
                    position: 'absolute',
                    top: top + 'px',
                    left: left + 'px',
                    width: streamWidth + 'px',
                    height: streamHeight + 'px',
                    border: borderWidth + 'px solid #9147ff',
                    borderRadius: '12px',
                    boxSizing: 'border-box',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease'
                };
            }
        }
    }

    function removeEmbedPlayer() {
        removeStreamContainer();
        updateControlPanel();
    }

    function createChatWindow(channelInput) {
        if (!channelInput) return;

        const channel = extractChannelName(channelInput);
        if (!channel) return;

        // Check if chat for this channel is already open
        const existingChat = openChats.find(c => c.channel === channel);
        if (existingChat) {
            // If minimized, show it. Otherwise, just focus it.
            if (existingChat.isMinimized) {
                showChatWindow(channel);
            } else {
                existingChat.window.style.zIndex = '10002';
            }
            return;
        }

        config.lastStreams = config.lastStreams.filter(s => s !== channel);
        config.lastStreams.unshift(channel);
        if (config.lastStreams.length > 10) config.lastStreams.pop();
        GM_setValue('lastStreams', config.lastStreams);

        // Calculate position offset based on number of open chats
        const offset = openChats.length * 30;

        const chatWindow = document.createElement('div');
        chatWindow.id = `offchat-chat-window-${channel}`;
        chatWindow.style.cssText = `
            position: fixed;
            top: ${100 + offset}px;
            right: ${20 + offset}px;
            width: 340px;
            height: 500px;
            background: #18181b;
            border: 1px solid #2f2f35;
            border-radius: 6px;
            z-index: 10002;
            box-shadow: 0 8px 24px rgba(0,0,0,0.5);
            display: flex;
            flex-direction: column;
            overflow: auto;
            resize: both;
            min-width: 250px;
            min-height: 300px;
            max-width: 90vw;
            max-height: 90vh;
        `;

        const chatHeader = document.createElement('div');
        chatHeader.id = 'offchat-chat-header';
        chatHeader.style.cssText = `
            padding: 10px 12px;
            background: #1f1f23;
            border-bottom: 1px solid #2f2f35;
            display: flex;
            align-items: center;
            justify-content: space-between;
            user-select: none;
            cursor: move;
        `;
        chatHeader.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" style="color: #bf94ff;">
                    <path d="M7.828 13L10 15.172 12.172 13H15a1 1 0 001-1V4a1 1 0 00-1-1H5a1 1 0 00-1 1v8a1 1 0 001 1h2.828zM10 18l-3-3H5a3 3 0 01-3-3V4a3 3 0 013-3h10a3 3 0 013 3v8a3 3 0 01-3 3h-2l-3 3z"/>
                </svg>
                <span style="font-weight: 600; font-size: 13px; color: #dedee3;">${channel}</span>
            </div>
            <div style="display: flex; gap: 8px;">
                <button class="offchat-chat-settings-btn" data-channel="${channel}" style="
                    background: none;
                    border: none;
                    color: #898395;
                    cursor: pointer;
                    font-size: 14px;
                    padding: 0;
                    line-height: 1;
                    display: flex;
                    align-items: center;
                " title="Minimal Mode">
                    <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 8a2 2 0 100 4 2 2 0 000-4zM2 10a2 2 0 114 0 2 2 0 01-4 0zm12 0a2 2 0 114 0 2 2 0 01-4 0z"/>
                    </svg>
                </button>
                <button class="offchat-minimize-chat-btn" data-channel="${channel}" style="
                    background: none;
                    border: none;
                    color: #898395;
                    cursor: pointer;
                    font-size: 16px;
                    padding: 0;
                    line-height: 1;
                " title="Minimize">−</button>
                <button class="offchat-close-chat-btn" data-channel="${channel}" style="
                    background: none;
                    border: none;
                    color: #898395;
                    cursor: pointer;
                    font-size: 16px;
                    padding: 0;
                    line-height: 1;
                " title="Close">×</button>
            </div>
        `;

        const chatIframe = document.createElement('iframe');
        chatIframe.id = 'offchat-chat-iframe';
        chatIframe.src = `https://www.twitch.tv/embed/${channel}/chat?parent=www.twitch.tv&darkpopout`;
        chatIframe.style.cssText = `
            width: 100%;
            border: none;
            flex: 1 1 auto;
            min-height: 0;
        `;

        chatWindow.appendChild(chatHeader);
        chatWindow.appendChild(chatIframe);
        document.body.appendChild(chatWindow);

        makeDraggable(chatWindow, chatHeader);

        const settingsBtn = chatWindow.querySelector('.offchat-chat-settings-btn');
        const minimizeBtn = chatWindow.querySelector('.offchat-minimize-chat-btn');
        const closeBtn = chatWindow.querySelector('.offchat-close-chat-btn');

        if (settingsBtn) {
            settingsBtn.onclick = () => toggleChatMinimalMode(channel);
        }

        if (minimizeBtn) {
            minimizeBtn.onclick = () => minimizeChatWindow(channel);
        }

        if (closeBtn) {
            closeBtn.onclick = () => removeChatWindow(channel);
        }

        // Add to openChats array
        openChats.push({
            channel: channel,
            window: chatWindow,
            minimizeButton: null,
            isMinimized: false,
            chatMode: 'normal', // 'normal', 'minimal', 'ultra'
            settingsIcon: null,
            overlays: null,
            resizeHandle: null
        });

        updateControlPanel();
    }

    function removeChatWindow(channel) {
        const chatIndex = openChats.findIndex(c => c.channel === channel);
        if (chatIndex === -1) return;

        const chat = openChats[chatIndex];
        if (chat.window) chat.window.remove();
        if (chat.minimizeButton) chat.minimizeButton.remove();
        if (chat.settingsIcon) chat.settingsIcon.remove();
        if (chat.resizeHandle) chat.resizeHandle.remove();
        // No need to clean up overlays since iframe is removed with window

        openChats.splice(chatIndex, 1);
        updateControlPanel();
    }

    function minimizeChatWindow(channel) {
        const chat = openChats.find(c => c.channel === channel);
        if (!chat) return;

        chat.window.style.display = 'none';
        chat.isMinimized = true;
        createChatMinimizeButton(channel);
        updateControlPanel();
    }

    function showChatWindow(channel) {
        const chat = openChats.find(c => c.channel === channel);
        if (!chat) return;

        chat.window.style.display = 'flex';
        chat.window.style.zIndex = '10002';
        chat.isMinimized = false;
        if (chat.minimizeButton) {
            chat.minimizeButton.remove();
            chat.minimizeButton = null;
        }
        updateControlPanel();
    }

    function toggleChatMinimalMode(channel) {
        const chat = openChats.find(c => c.channel === channel);
        if (!chat) return;

        // Cycle through modes: normal → minimal → ultra → normal
        if (chat.chatMode === 'normal') {
            chat.chatMode = 'minimal';
        } else if (chat.chatMode === 'minimal') {
            chat.chatMode = 'ultra';
        } else {
            chat.chatMode = 'normal';
        }

        const chatHeader = chat.window.querySelector('#offchat-chat-header');
        const chatIframe = chat.window.querySelector('#offchat-chat-iframe');

        // Clean up any existing overlays, settings icon, and resize handle
        if (chat.settingsIcon) {
            chat.settingsIcon.remove();
            chat.settingsIcon = null;
        }
        if (chat.overlays && chat.overlays.iframe) {
            // Reset iframe clipping styles
            const iframe = chat.overlays.iframe;
            iframe.style.clipPath = '';
            iframe.style.marginTop = '';
            iframe.style.marginBottom = '';
            iframe.style.height = '';
            chat.overlays = null;
        }
        if (chat.resizeHandle) {
            chat.resizeHandle.remove();
            chat.resizeHandle = null;
        }

        if (chat.chatMode === 'normal') {
            // Normal mode - show everything

            // Show the header
            if (chatHeader) {
                chatHeader.style.display = 'flex';
            }

            // Restore window styling
            chat.window.style.background = '#18181b';
            chat.window.style.border = '1px solid #2f2f35';
            chat.window.style.boxShadow = '0 8px 24px rgba(0,0,0,0.5)';
            chat.window.style.borderRadius = '6px';

            // Restore scrolling and resizing
            chat.window.style.overflow = 'auto';
            chat.window.style.resize = 'both';

            // Restore iframe styling
            if (chatIframe) {
                chatIframe.style.borderRadius = '';
            }

        } else if (chat.chatMode === 'minimal') {
            // Minimal mode - hide our window chrome only

            // Hide the header
            if (chatHeader) {
                chatHeader.style.display = 'none';
            }

            // Remove window background and borders
            chat.window.style.background = 'transparent';
            chat.window.style.border = 'none';
            chat.window.style.boxShadow = 'none';
            chat.window.style.borderRadius = '0';

            // Make iframe fill the entire window
            if (chatIframe) {
                chatIframe.style.borderRadius = '0';
            }

            // Create floating settings icon
            createMinimalChatSettingsIcon(channel);

        } else if (chat.chatMode === 'ultra') {
            // Ultra-minimal mode - hide our chrome + Twitch UI elements

            // Hide the header
            if (chatHeader) {
                chatHeader.style.display = 'none';
            }

            // Remove window background and borders
            chat.window.style.background = 'transparent';
            chat.window.style.border = 'none';
            chat.window.style.boxShadow = 'none';
            chat.window.style.borderRadius = '0';

            // Disable scrolling and resizing in ultra mode
            chat.window.style.overflow = 'hidden';
            chat.window.style.resize = 'none';

            // Make iframe fill the entire window
            if (chatIframe) {
                chatIframe.style.borderRadius = '0';
            }

            // Create overlays to hide Twitch UI elements
            createChatOverlays(channel);

            // Create small resize handle in bottom-right
            createChatResizeHandle(channel);

            // Create floating settings icon
            createMinimalChatSettingsIcon(channel);
        }
    }

    function createChatOverlays(channel) {
        const chat = openChats.find(c => c.channel === channel);
        if (!chat) return;

        const chatIframe = chat.window.querySelector('#offchat-chat-iframe');
        if (!chatIframe) return;

        // Use CSS clip-path to crop the iframe
        // This hides: top 110px (notifications/top bar) and bottom 103px (input field)
        chatIframe.style.clipPath = 'inset(110px 0px 103px 0px)';

        // Adjust iframe to compensate for clipping
        chatIframe.style.marginTop = '-110px';
        chatIframe.style.marginBottom = '-103px';
        chatIframe.style.height = 'calc(100% + 213px)'; // Add back clipped height

        // Store reference (we'll store the iframe itself to reset later)
        chat.overlays = { iframe: chatIframe };
    }

    function createChatResizeHandle(channel) {
        const chat = openChats.find(c => c.channel === channel);
        if (!chat) return;

        // Create small resize handle
        const resizeHandle = document.createElement('div');
        resizeHandle.id = `offchat-chat-resize-${channel}`;
        resizeHandle.style.cssText = `
            position: absolute;
            bottom: 0;
            right: 0;
            width: 12px;
            height: 12px;
            background: rgba(145, 71, 255, 0.6);
            cursor: nwse-resize;
            z-index: 20;
            border-top-left-radius: 3px;
            pointer-events: auto;
        `;

        // Make it draggable for resizing
        let isResizing = false;
        let startX, startY, startWidth, startHeight;
        let animationFrame = null;

        const onMouseMove = (e) => {
            if (!isResizing) return;
            e.preventDefault();

            // Use requestAnimationFrame for smoother resizing
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }

            animationFrame = requestAnimationFrame(() => {
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;
                const newWidth = Math.max(250, startWidth + dx);
                const newHeight = Math.max(300, startHeight + dy);

                chat.window.style.width = newWidth + 'px';
                chat.window.style.height = newHeight + 'px';
                chat.window.style.maxWidth = 'none';
                chat.window.style.maxHeight = 'none';
            });
        };

        const onMouseUp = () => {
            if (isResizing) {
                isResizing = false;
                if (animationFrame) {
                    cancelAnimationFrame(animationFrame);
                    animationFrame = null;
                }
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            }
        };

        resizeHandle.addEventListener('mousedown', (e) => {
            isResizing = true;
            startX = e.clientX;
            startY = e.clientY;
            const rect = chat.window.getBoundingClientRect();
            startWidth = rect.width;
            startHeight = rect.height;
            e.preventDefault();
            e.stopPropagation();

            // Add listeners only when actively resizing
            document.addEventListener('mousemove', onMouseMove, { passive: false });
            document.addEventListener('mouseup', onMouseUp);
        });

        // Hover effect
        resizeHandle.onmouseenter = () => {
            resizeHandle.style.background = 'rgba(145, 71, 255, 0.9)';
        };

        resizeHandle.onmouseleave = () => {
            resizeHandle.style.background = 'rgba(145, 71, 255, 0.6)';
        };

        chat.window.appendChild(resizeHandle);
        chat.resizeHandle = resizeHandle;
    }

    function createMinimalChatSettingsIcon(channel) {
        const chat = openChats.find(c => c.channel === channel);
        if (!chat) return;

        // Create floating settings icon
        const settingsIcon = document.createElement('button');
        settingsIcon.id = `offchat-minimal-chat-settings-${channel}`;
        settingsIcon.title = chat.chatMode === 'minimal' ? 'Ultra-Minimal Mode' : 'Back to Normal';
        settingsIcon.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 8a2 2 0 100 4 2 2 0 000-4zM2 10a2 2 0 114 0 2 2 0 01-4 0zm12 0a2 2 0 114 0 2 2 0 01-4 0z"/>
            </svg>
        `;

        settingsIcon.style.cssText = `
            position: absolute;
            top: 8px;
            right: 8px;
            background: rgba(0, 0, 0, 0.7);
            border: 1px solid #2f2f35;
            border-radius: 4px;
            color: #bf94ff;
            cursor: pointer;
            padding: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10;
            opacity: 0;
            transition: opacity 0.2s ease;
            pointer-events: auto;
        `;

        settingsIcon.onclick = () => toggleChatMinimalMode(channel);

        // Append to chat window
        chat.window.appendChild(settingsIcon);
        chat.settingsIcon = settingsIcon;

        // Show icon on hover
        chat.window.onmouseenter = () => {
            if ((chat.chatMode === 'minimal' || chat.chatMode === 'ultra') && settingsIcon) {
                settingsIcon.style.opacity = '1';
            }
        };

        chat.window.onmouseleave = () => {
            if ((chat.chatMode === 'minimal' || chat.chatMode === 'ultra') && settingsIcon) {
                settingsIcon.style.opacity = '0';
            }
        };

        // Hover effect for the icon itself
        settingsIcon.onmouseenter = () => {
            settingsIcon.style.background = 'rgba(145, 71, 255, 0.3)';
            settingsIcon.style.color = '#fff';
        };

        settingsIcon.onmouseleave = () => {
            settingsIcon.style.background = 'rgba(0, 0, 0, 0.7)';
            settingsIcon.style.color = '#bf94ff';
        };
    }

    function createChatMinimizeButton(channel) {
        const chat = openChats.find(c => c.channel === channel);
        if (!chat) return;

        // Find index to calculate position
        const chatIndex = openChats.findIndex(c => c.channel === channel);
        const offset = chatIndex * 40; // 40px spacing for minimize buttons

        const minimizeButton = document.createElement('button');
        minimizeButton.id = `offchat-chat-minimize-btn-${channel}`;
        minimizeButton.title = `Chat: ${channel}`;
        minimizeButton.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M7.828 13L10 15.172 12.172 13H15a1 1 0 001-1V4a1 1 0 00-1-1H5a1 1 0 00-1 1v8a1 1 0 001 1h2.828zM10 18l-3-3H5a3 3 0 01-3-3V4a3 3 0 013-3h10a3 3 0 013 3v8a3 3 0 01-3 3h-2l-3 3z"/>
            </svg>
        `;

        minimizeButton.style.cssText = `
            display: inline-flex !important;
            align-items: center;
            justify-content: center;
            width: 30px;
            height: 30px;
            background: rgba(24, 24, 27, 0.95);
            border: 1px solid #2f2f35;
            border-radius: 4px;
            color: #bf94ff;
            cursor: pointer;
            transition: background-color 0.1s, color 0.1s;
            padding: 0;
            position: fixed;
            top: ${100 + offset}px;
            right: 20px;
            z-index: 10001;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        `;

        minimizeButton.onmouseenter = () => {
            minimizeButton.style.background = 'rgba(83, 83, 95, 0.48)';
            minimizeButton.style.color = '#fff';
        };
        minimizeButton.onmouseleave = () => {
            minimizeButton.style.background = 'transparent';
            minimizeButton.style.color = '#dedee3';
        };
        minimizeButton.onclick = () => showChatWindow(channel);

        document.body.appendChild(minimizeButton);
        chat.minimizeButton = minimizeButton;
    }

    function createControlPanel() {
        if (controlPanel) controlPanel.remove();

        controlPanel = document.createElement('div');
        controlPanel.id = 'offchat-control-panel';
        controlPanel.style.cssText = `
            position: fixed;
            bottom: 100px;
            right: 370px;
            background: #18181b;
            border: 1px solid #2f2f35;
            border-radius: 6px;
            z-index: 10001;
            font-family: 'Inter', 'Roobert', sans-serif;
            color: #efeff1;
            width: 240px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.5);
            overflow: hidden;
        `;

        document.body.appendChild(controlPanel);
        updateControlPanel();
        
        const header = controlPanel.querySelector('#offchat-header');
        if (header) makeDraggable(controlPanel, header);
    }

    function updateControlPanel() {
        if (!controlPanel) return;

        controlPanel.innerHTML = `
            <div id="offchat-header" style="
                padding: 10px 12px;
                background: #1f1f23;
                border-bottom: 1px solid #2f2f35;
                display: flex;
                align-items: center;
                justify-content: space-between;
                user-select: none;
                cursor: move;
            ">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <button id="offchat-stream-icon" style="
                        background: none;
                        border: none;
                        color: ${currentPanelMode === 'stream' ? '#bf94ff' : '#898395'};
                        cursor: pointer;
                        padding: 0;
                        display: flex;
                        align-items: center;
                        transition: color 0.1s ease-in;
                    " title="Stream Viewer">
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 1.5h10a.5.5 0 01.5.5v10a.5.5 0 01-.5.5H5a.5.5 0 01-.5-.5V5a.5.5 0 01.5-.5z"/>
                            <path d="M8 7l5 3-5 3V7z"/>
                        </svg>
                    </button>
                    <button id="offchat-chat-icon" style="
                        background: none;
                        border: none;
                        color: ${currentPanelMode === 'chat' ? '#bf94ff' : '#898395'};
                        cursor: pointer;
                        padding: 0;
                        display: flex;
                        align-items: center;
                        transition: color 0.1s ease-in;
                    " title="Chat Viewer">
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M7.828 13L10 15.172 12.172 13H15a1 1 0 001-1V4a1 1 0 00-1-1H5a1 1 0 00-1 1v8a1 1 0 001 1h2.828zM10 18l-3-3H5a3 3 0 01-3-3V4a3 3 0 013-3h10a3 3 0 013 3v8a3 3 0 01-3 3h-2l-3 3z"/>
                        </svg>
                    </button>
                    <button id="offchat-theater-icon" style="
                        background: none;
                        border: none;
                        color: ${isTheaterMode ? '#bf94ff' : '#898395'};
                        cursor: pointer;
                        padding: 0;
                        display: flex;
                        align-items: center;
                        transition: color 0.1s ease-in;
                    " title="Theater Mode (T)">
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2 4a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V4zm2-0.5A.5.5 0 003.5 4v12a.5.5 0 00.5.5h12a.5.5 0 00.5-.5V4a.5.5 0 00-.5-.5H4z"/>
                            <path d="M6 6h8v8H6V6z"/>
                        </svg>
                    </button>
                    <span style="font-weight: 600; font-size: 13px; color: #dedee3;">${currentPanelMode === 'stream' ? 'Stream Viewer' : 'Chat Viewer'}</span>
                </div>
                <button id="offchat-close-panel" style="
                    background: none;
                    border: none;
                    color: #898395;
                    cursor: pointer;
                    font-size: 16px;
                    padding: 0;
                    line-height: 1;
                " title="Minimize">−</button>
            </div>
            <div style="padding: 12px;">
                ${currentPanelMode === 'stream' && openStreams.length > 0 ? `
                    <div style="margin-bottom: 8px;">
                        <div style="font-size: 11px; color: #898395; margin-bottom: 6px;">Open Streams (${openStreams.length}/4)</div>
                        ${openStreams.map((stream, index) => `
                            <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 4px; padding: 6px; background: rgba(83, 83, 95, 0.2); border-radius: 4px;">
                                <span style="flex: 1; font-size: 12px; color: #efeff1;">${stream.displayName}${index === focusedStreamIndex ? ' ⭐' : ''}</span>
                                <button class="offchat-focus-stream-btn" data-index="${index}" style="
                                    padding: 4px 8px;
                                    height: 24px;
                                    background: rgba(83, 83, 95, 0.38);
                                    border: none;
                                    border-radius: 12px;
                                    color: #efeff1;
                                    cursor: pointer;
                                    font-size: 11px;
                                    font-weight: 600;
                                    transition: background-color 0.1s ease-in;
                                ">${index === focusedStreamIndex ? 'Grid' : 'Focus'}</button>
                                <button class="offchat-remove-stream-btn" data-id="${stream.id}" data-type="${stream.type}" style="
                                    padding: 4px 8px;
                                    height: 24px;
                                    background: rgba(83, 83, 95, 0.38);
                                    border: none;
                                    border-radius: 12px;
                                    color: #efeff1;
                                    cursor: pointer;
                                    font-size: 11px;
                                    font-weight: 600;
                                    transition: background-color 0.1s ease-in;
                                ">✕</button>
                            </div>
                        `).join('')}
                    </div>
                    ${openStreams.length < 4 ? `
                        <input type="text" id="offchat-channel-input"
                            placeholder="Add another stream..."
                            style="
                                width: 100%;
                                padding: 8px 10px;
                                height: 30px;
                                background: rgba(14, 14, 16, 1);
                                border: 2px solid #464649;
                                border-radius: 4px;
                                color: #efeff1;
                                margin-bottom: 8px;
                                box-sizing: border-box;
                                font-size: 13px;
                                font-family: inherit;
                                outline: none;
                                transition: border-color 0.1s ease-in, background-color 0.1s ease-in;
                            ">
                        <button id="offchat-embed-btn" style="
                            width: 100%;
                            padding: 5px 10px;
                            height: 30px;
                            background: #9147ff;
                            border: none;
                            border-radius: 4px;
                            color: #fff;
                            cursor: pointer;
                            font-weight: 600;
                            font-size: 13px;
                            font-family: inherit;
                            transition: background-color 0.1s ease-in, color 0.1s ease-in;
                            display: inline-flex;
                            align-items: center;
                            justify-content: center;
                        ">+ Add Stream</button>
                    ` : ''}
                ` : currentPanelMode === 'chat' && openChats.length > 0 ? `
                    <div style="margin-bottom: 8px;">
                        <div style="font-size: 11px; color: #898395; margin-bottom: 6px;">Open Chats (${openChats.length})</div>
                        ${openChats.map(chat => `
                            <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 4px; padding: 6px; background: rgba(83, 83, 95, 0.2); border-radius: 4px;">
                                <span style="flex: 1; font-size: 12px; color: #efeff1;">${chat.channel}</span>
                                <button class="offchat-toggle-chat-btn" data-channel="${chat.channel}" style="
                                    padding: 4px 8px;
                                    height: 24px;
                                    background: rgba(83, 83, 95, 0.38);
                                    border: none;
                                    border-radius: 12px;
                                    color: #efeff1;
                                    cursor: pointer;
                                    font-size: 11px;
                                    font-weight: 600;
                                    transition: background-color 0.1s ease-in;
                                ">${chat.isMinimized ? 'Show' : 'Hide'}</button>
                                <button class="offchat-remove-chat-btn" data-channel="${chat.channel}" style="
                                    padding: 4px 8px;
                                    height: 24px;
                                    background: rgba(83, 83, 95, 0.38);
                                    border: none;
                                    border-radius: 12px;
                                    color: #efeff1;
                                    cursor: pointer;
                                    font-size: 11px;
                                    font-weight: 600;
                                    transition: background-color 0.1s ease-in;
                                ">✕</button>
                            </div>
                        `).join('')}
                    </div>
                    <input type="text" id="offchat-channel-input"
                        placeholder="Open another chat..."
                        style="
                            width: 100%;
                            padding: 8px 10px;
                            height: 30px;
                            background: rgba(14, 14, 16, 1);
                            border: 2px solid #464649;
                            border-radius: 4px;
                            color: #efeff1;
                            margin-bottom: 8px;
                            box-sizing: border-box;
                            font-size: 13px;
                            font-family: inherit;
                            outline: none;
                            transition: border-color 0.1s ease-in, background-color 0.1s ease-in;
                        ">
                    <button id="offchat-embed-btn" style="
                        width: 100%;
                        padding: 5px 10px;
                        height: 30px;
                        background: #9147ff;
                        border: none;
                        border-radius: 4px;
                        color: #fff;
                        cursor: pointer;
                        font-weight: 600;
                        font-size: 13px;
                        font-family: inherit;
                        transition: background-color 0.1s ease-in, color 0.1s ease-in;
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                    ">+ Open Chat</button>
                ` : `
                    <input type="text" id="offchat-channel-input"
                        placeholder="${currentPanelMode === 'stream' ? 'twitch.tv/... or channel name' : 'Chat: twitch.tv/... or channel name'}"
                        style="
                            width: 100%;
                            padding: 8px 10px;
                            height: 30px;
                            background: rgba(14, 14, 16, 1);
                            border: 2px solid #464649;
                            border-radius: 4px;
                            color: #efeff1;
                            margin-bottom: 8px;
                            box-sizing: border-box;
                            font-size: 13px;
                            font-family: inherit;
                            outline: none;
                            transition: border-color 0.1s ease-in, background-color 0.1s ease-in;
                        ">
                    <button id="offchat-embed-btn" style="
                        width: 100%;
                        padding: 5px 10px;
                        height: 30px;
                        background: #9147ff;
                        border: none;
                        border-radius: 4px;
                        color: #fff;
                        cursor: pointer;
                        font-weight: 600;
                        font-size: 13px;
                        font-family: inherit;
                        transition: background-color 0.1s ease-in, color 0.1s ease-in;
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                    ">${currentPanelMode === 'stream' ? 'Watch' : 'Open Chat'}</button>
                    ${config.lastStreams.length > 0 ? `
                        <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #2f2f35;">
                            <div style="font-size: 11px; color: #898395; margin-bottom: 6px;">Recent</div>
                            <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                                ${config.lastStreams.slice(0, 6).map(s => `
                                    <button class="offchat-recent-btn" data-channel="${s}" style="
                                        padding: 4px 10px;
                                        height: 24px;
                                        background: rgba(83, 83, 95, 0.38);
                                        border: none;
                                        border-radius: 12px;
                                        color: #efeff1;
                                        cursor: pointer;
                                        font-size: 12px;
                                        font-weight: 600;
                                        font-family: inherit;
                                        transition: background-color 0.1s ease-in;
                                        display: inline-flex;
                                        align-items: center;
                                        justify-content: center;
                                    ">${s}</button>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                `}
            </div>
        `;

        const closePanel = document.getElementById('offchat-close-panel');
        const embedBtn = document.getElementById('offchat-embed-btn');
        const channelInput = document.getElementById('offchat-channel-input');
        const focusStreamBtns = document.querySelectorAll('.offchat-focus-stream-btn');
        const removeStreamBtns = document.querySelectorAll('.offchat-remove-stream-btn');
        const toggleChatBtns = document.querySelectorAll('.offchat-toggle-chat-btn');
        const removeChatBtns = document.querySelectorAll('.offchat-remove-chat-btn');
        const recentBtns = document.querySelectorAll('.offchat-recent-btn');
        const header = document.getElementById('offchat-header');
        const streamIcon = document.getElementById('offchat-stream-icon');
        const chatIcon = document.getElementById('offchat-chat-icon');
        const theaterIcon = document.getElementById('offchat-theater-icon');

        if (streamIcon) {
            streamIcon.onclick = () => {
                currentPanelMode = 'stream';
                updateControlPanel();
            };
            streamIcon.onmouseenter = () => streamIcon.style.color = '#a970ff';
            streamIcon.onmouseleave = () => streamIcon.style.color = currentPanelMode === 'stream' ? '#bf94ff' : '#898395';
        }

        if (chatIcon) {
            chatIcon.onclick = () => {
                currentPanelMode = 'chat';
                updateControlPanel();
            };
            chatIcon.onmouseenter = () => chatIcon.style.color = '#a970ff';
            chatIcon.onmouseleave = () => chatIcon.style.color = currentPanelMode === 'chat' ? '#bf94ff' : '#898395';
        }

        if (theaterIcon) {
            theaterIcon.onclick = () => {
                toggleTheaterMode();
            };
            theaterIcon.onmouseenter = () => theaterIcon.style.color = '#a970ff';
            theaterIcon.onmouseleave = () => theaterIcon.style.color = isTheaterMode ? '#bf94ff' : '#898395';
        }

        if (closePanel) {
            closePanel.onclick = () => {
                controlPanel.style.display = 'none';
                createShowButton();
            };
        }

        if (embedBtn && channelInput) {
            embedBtn.onclick = () => {
                const value = channelInput.value.trim();
                if (value) {
                    if (currentPanelMode === 'stream') {
                        createEmbedPlayer(value);
                    } else {
                        createChatWindow(value);
                    }
                } else {
                    channelInput.style.borderColor = '#9147ff';
                    channelInput.focus();
                }
            };
            embedBtn.onmouseenter = () => embedBtn.style.background = '#772ce8';
            embedBtn.onmouseleave = () => embedBtn.style.background = '#9147ff';
            channelInput.onkeydown = (e) => { if (e.key === 'Enter') embedBtn.click(); };
            channelInput.onfocus = () => {
                channelInput.style.borderColor = '#a970ff';
                channelInput.style.background = 'rgba(14, 14, 16, 1)';
            };
            channelInput.onblur = () => {
                channelInput.style.borderColor = '#464649';
                channelInput.style.background = 'rgba(14, 14, 16, 1)';
            };
        }

        focusStreamBtns.forEach(btn => {
            const index = parseInt(btn.dataset.index);
            btn.onclick = () => toggleStreamFocus(index);
            btn.onmouseenter = () => btn.style.background = 'rgba(83, 83, 95, 0.48)';
            btn.onmouseleave = () => btn.style.background = 'rgba(83, 83, 95, 0.38)';
        });

        removeStreamBtns.forEach(btn => {
            const streamId = btn.dataset.id;
            const streamType = btn.dataset.type;
            btn.onclick = () => removeStream(streamId, streamType);
            btn.onmouseenter = () => btn.style.background = 'rgba(83, 83, 95, 0.48)';
            btn.onmouseleave = () => btn.style.background = 'rgba(83, 83, 95, 0.38)';
        });

        toggleChatBtns.forEach(btn => {
            const channel = btn.dataset.channel;
            btn.onclick = () => {
                const chat = openChats.find(c => c.channel === channel);
                if (chat) {
                    if (chat.isMinimized) {
                        showChatWindow(channel);
                    } else {
                        minimizeChatWindow(channel);
                    }
                }
            };
            btn.onmouseenter = () => btn.style.background = 'rgba(83, 83, 95, 0.48)';
            btn.onmouseleave = () => btn.style.background = 'rgba(83, 83, 95, 0.38)';
        });

        removeChatBtns.forEach(btn => {
            const channel = btn.dataset.channel;
            btn.onclick = () => removeChatWindow(channel);
            btn.onmouseenter = () => btn.style.background = 'rgba(83, 83, 95, 0.48)';
            btn.onmouseleave = () => btn.style.background = 'rgba(83, 83, 95, 0.38)';
        });

        recentBtns.forEach(btn => {
            btn.onclick = () => {
                if (currentPanelMode === 'stream') {
                    createEmbedPlayer(btn.dataset.channel);
                } else {
                    createChatWindow(btn.dataset.channel);
                }
            };
            btn.onmouseenter = () => btn.style.background = 'rgba(83, 83, 95, 0.48)';
            btn.onmouseleave = () => btn.style.background = 'rgba(83, 83, 95, 0.38)';
        });

        if (header) makeDraggable(controlPanel, header);
    }

    function createShowButton() {
        let btn = document.getElementById('offchat-show-btn');
        if (btn && document.body.contains(btn)) {
            btn.style.display = 'inline-flex';
            btn.style.visibility = 'visible';
            return;
        }

        if (btn) btn.remove();

        btn = document.createElement('button');
        btn.id = 'offchat-show-btn';
        btn.title = 'Offchat Viewer';
        btn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 1.5h10a.5.5 0 01.5.5v10a.5.5 0 01-.5.5H5a.5.5 0 01-.5-.5V5a.5.5 0 01.5-.5z"/>
                <path d="M8 7l5 3-5 3V7z"/>
            </svg>
        `;

        btn.style.cssText = `
            display: inline-flex !important;
            align-items: center;
            justify-content: center;
            width: 30px;
            height: 30px;
            background: transparent;
            border: none;
            border-radius: 4px;
            color: #dedee3;
            cursor: pointer;
            transition: background-color 0.1s, color 0.1s;
            padding: 0;
            margin-left: 5px;
            vertical-align: middle;
            visibility: visible !important;
            opacity: 1 !important;
            z-index: 9999;
        `;
        btn.onmouseenter = () => {
            btn.style.background = 'rgba(83, 83, 95, 0.48)';
            btn.style.color = '#fff';
        };
        btn.onmouseleave = () => {
            btn.style.background = 'transparent';
            btn.style.color = '#dedee3';
        };
        btn.onclick = () => {
            if (controlPanel) {
                controlPanel.style.display = 'block';
                btn.style.display = 'none';
            }
        };

        const insertButton = () => {
            // Remove any existing button first
            const existingBtn = document.getElementById('offchat-show-btn');
            if (existingBtn && existingBtn !== btn) {
                existingBtn.remove();
            }

            // Try multiple selectors for the share button
            const shareBtn = document.querySelector('[data-a-target="share-button"]') ||
                            document.querySelector('[aria-label="Share"]') ||
                            document.querySelector('button[aria-label*="Share"]') ||
                            document.querySelector('button[data-test-selector="share-button"]');

            if (shareBtn && shareBtn.parentNode) {
                shareBtn.parentNode.insertBefore(btn, shareBtn.nextSibling);
                console.log('[Offchat] Button inserted next to share button');
                return true;
            }

            // Try channel header buttons area
            const channelButtons = document.querySelector('.channel-header__user-tab-content .tw-align-items-center') ||
                                 document.querySelector('[data-a-target="channel-header-right"]') ||
                                 document.querySelector('.channel-info-content__action-container');

            if (channelButtons) {
                channelButtons.appendChild(btn);
                console.log('[Offchat] Button inserted in channel buttons area');
                return true;
            }

            // Try metadata layout
            const metadataLayout = document.querySelector('.metadata-layout__secondary-button-spacing');
            if (metadataLayout) {
                metadataLayout.appendChild(btn);
                console.log('[Offchat] Button inserted in metadata layout');
                return true;
            }

            return false;
        };

        if (!insertButton()) {
            // Keep trying very aggressively
            let attempts = 0;
            const retryInterval = setInterval(() => {
                attempts++;

                if (document.body.contains(btn)) {
                    // Button exists, try to relocate it to proper position
                    const shareBtn = document.querySelector('[data-a-target="share-button"]');
                    if (shareBtn && shareBtn.parentNode) {
                        // Check if button is not already next to share button
                        if (shareBtn.nextSibling !== btn) {
                            // Remove from current position and insert next to share
                            btn.remove();
                            shareBtn.parentNode.insertBefore(btn, shareBtn.nextSibling);
                            console.log('[Offchat] Button relocated next to share button');
                        }
                        // Button is in correct position, stop trying
                        clearInterval(retryInterval);
                        return;
                    }
                } else {
                    // Button doesn't exist, try to insert it
                    if (insertButton()) {
                        clearInterval(retryInterval);
                        return;
                    }

                    // After 5 attempts, use fallback position
                    if (attempts === 5) {
                        btn.style.cssText += `
                            position: fixed !important;
                            top: 60px !important;
                            right: 20px !important;
                            z-index: 10001 !important;
                            box-shadow: 0 2px 8px rgba(0,0,0,0.5) !important;
                            background: rgba(24, 24, 27, 0.95) !important;
                        `;
                        document.body.appendChild(btn);
                        console.log('[Offchat] Using fallback position (top-right)');
                        // Don't stop trying, continue to relocate if possible
                    }
                }

                // Give up after 60 attempts (30 seconds)
                if (attempts > 60) {
                    clearInterval(retryInterval);
                    console.log('[Offchat] Stopped trying to relocate button after 60 attempts');
                }
            }, 500);
        }
    }

    function cleanup() {
        removeStreamContainer();
        // Remove all chat windows
        [...openChats].forEach(chat => removeChatWindow(chat.channel));
        if (controlPanel) { controlPanel.remove(); controlPanel = null; }
        const showBtn = document.getElementById('offchat-show-btn');
        if (showBtn) showBtn.remove();
        if (buttonCheckInterval) { clearInterval(buttonCheckInterval); buttonCheckInterval = null; }
        currentPanelMode = 'stream';
        streamWrapperCache = {}; // Clear wrapper cache
        if (resizeUpdateBound) {
            window.removeEventListener('resize', resizeUpdateBound);
            window.removeEventListener('scroll', resizeUpdateBound);
            resizeUpdateBound = null;
        }
        // Exit theater mode if active
        if (isTheaterMode) {
            toggleTheaterMode();
        }
    }

    function toggleTheaterMode() {
        isTheaterMode = !isTheaterMode;

        if (isTheaterMode) {
            // Enter theater mode

            // Create style to hide Twitch UI
            if (!theaterModeStyle) {
                theaterModeStyle = document.createElement('style');
                theaterModeStyle.id = 'offchat-theater-mode';
                document.head.appendChild(theaterModeStyle);
            }

            theaterModeStyle.textContent = `
                /* Hide Twitch navigation and UI */
                nav[aria-label="Primary Navigation"],
                .top-nav,
                [data-a-target="top-nav-container"],
                .twilight-minimal-root .top-nav__menu,
                .side-nav,
                [data-a-target="side-nav"],
                .side-nav-section,
                .channel-root__right-column,
                .stream-chat,
                [data-a-target="right-column-chat-bar"],
                .video-chat__overlay,
                .channel-info-content,
                .channel-leaderboard,
                [data-a-target="channel-header"],
                .about-section,
                .simplebar-scroll-content,
                .channel-root__player-footer,
                .chat-shell,
                .stream-chat-header,
                .persistent-player,
                [data-a-target="video-player"],
                .video-player,
                .video-player__container {
                    display: none !important;
                }

                /* Ensure body takes full space */
                body {
                    overflow: hidden !important;
                }

                /* Make our stream container take full viewport */
                #offchat-embed-wrapper {
                    position: fixed !important;
                    top: 0 !important;
                    left: 0 !important;
                    width: 100vw !important;
                    height: 100vh !important;
                    z-index: 999999 !important;
                }

                /* Ensure chats and control panel stay visible */
                #offchat-control-panel,
                [id^="offchat-chat-window-"],
                [id^="offchat-chat-minimize-btn-"],
                #offchat-show-btn {
                    z-index: 10000000 !important;
                }
            `;

            // Enter fullscreen to hide browser chrome
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen().catch(err => {
                    console.log('[Offchat] Fullscreen request failed:', err);
                });
            }

            // Update streams to fill viewport
            if (streamContainer) {
                renderStreamContainer();
            }

            // Show notification
            showTheaterModeNotification('Theater Mode Enabled - Press T to exit');

            // Update control panel to reflect theater mode
            updateControlPanel();

        } else {
            // Exit theater mode

            // Remove theater mode styles completely
            if (theaterModeStyle && theaterModeStyle.parentNode) {
                theaterModeStyle.remove();
                theaterModeStyle = null;
            }

            // Exit fullscreen
            if (document.fullscreenElement) {
                document.exitFullscreen().catch(err => {
                    console.log('[Offchat] Exit fullscreen failed:', err);
                });
            }

            // Force a reflow to ensure CSS is cleared before re-rendering
            // Wait a bit for Twitch UI to reappear
            setTimeout(() => {
                // Update streams to normal size
                if (streamContainer) {
                    renderStreamContainer();
                }
            }, 100);

            // Show notification
            showTheaterModeNotification('Theater Mode Disabled');

            // Update control panel to reflect theater mode
            updateControlPanel();
        }
    }

    function showTheaterModeNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.9);
            color: #fff;
            padding: 12px 24px;
            border-radius: 8px;
            font-family: 'Inter', 'Roobert', sans-serif;
            font-size: 14px;
            font-weight: 600;
            z-index: 100000000;
            border: 2px solid #9147ff;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
            pointer-events: none;
            animation: offchat-fade-in-out 2s ease-in-out;
        `;
        notification.textContent = message;

        // Add animation
        const animStyle = document.createElement('style');
        animStyle.textContent = `
            @keyframes offchat-fade-in-out {
                0% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
                15% { opacity: 1; transform: translateX(-50%) translateY(0); }
                85% { opacity: 1; transform: translateX(-50%) translateY(0); }
                100% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
            }
        `;
        document.head.appendChild(animStyle);

        document.body.appendChild(notification);
        setTimeout(() => {
            notification.remove();
            animStyle.remove();
        }, 2000);
    }

    function toggleMainStreamHide() {
        isMainStreamHidden = !isMainStreamHidden;

        const playerContainer = document.querySelector('[data-a-target="video-player"]') ||
                               document.querySelector('.video-player__container') ||
                               document.querySelector('.video-player') ||
                               document.querySelector('.persistent-player');

        if (playerContainer) {
            if (isMainStreamHidden) {
                playerContainer.style.opacity = '0';
                playerContainer.style.pointerEvents = 'none';
                // Try to pause the video
                const video = playerContainer.querySelector('video');
                if (video) {
                    video.pause();
                    video.muted = true;
                }
                showTheaterModeNotification('Main Stream Hidden');
            } else {
                playerContainer.style.opacity = '1';
                playerContainer.style.pointerEvents = 'auto';
                showTheaterModeNotification('Main Stream Visible');
            }
        }

        // Update control panel if it exists
        if (controlPanel) updateControlPanel();
    }

    function toggleSyncMute() {
        if (openStreams.length === 0) {
            showTheaterModeNotification('No streams open to mute');
            return;
        }

        isMuted = !isMuted;

        // Send mute/unmute commands to all stream iframes
        openStreams.forEach(stream => {
            const streamKey = `${stream.type}-${stream.id}`;
            const wrapper = streamWrapperCache[streamKey];
            if (!wrapper) return;

            const iframe = wrapper.querySelector('iframe');
            if (!iframe || !iframe.contentWindow) return;

            if (stream.type === 'twitch') {
                // Use Twitch Embed postMessage API
                // Twitch player listens for these commands
                try {
                    iframe.contentWindow.postMessage(
                        JSON.stringify({
                            namespace: 'twitch-embed-player-proxy',
                            method: isMuted ? 'setMuted' : 'setMuted',
                            arguments: [isMuted]
                        }),
                        'https://player.twitch.tv'
                    );
                } catch (e) {
                    console.log('[Offchat] Failed to send mute command to Twitch iframe:', e);
                }
            } else if (stream.type === 'youtube') {
                // Use YouTube IFrame API postMessage
                try {
                    iframe.contentWindow.postMessage(
                        JSON.stringify({
                            event: 'command',
                            func: isMuted ? 'mute' : 'unMute',
                            args: []
                        }),
                        'https://www.youtube.com'
                    );
                } catch (e) {
                    console.log('[Offchat] Failed to send mute command to YouTube iframe:', e);
                }
            }
        });

        // Show notification
        showTheaterModeNotification(isMuted ? 'All Streams Muted' : 'All Streams Unmuted');

        // Update control panel to reflect mute state
        if (controlPanel) updateControlPanel();
    }

    function init() {
        if (!isChannelPage()) return;
        currentChannel = getCurrentChannel();
        if (!currentChannel) return;
        lastChannel = currentChannel;

        setTimeout(() => {
            createControlPanel();
            controlPanel.style.display = 'none';
            createShowButton();

            // More frequent monitoring (every 1 second)
            buttonCheckInterval = setInterval(() => {
                const btn = document.getElementById('offchat-show-btn');
                if (!btn || !document.body.contains(btn)) {
                    console.log('[Offchat] Button missing, recreating...');
                    createShowButton();
                } else {
                    // Check if button is visible
                    const styles = window.getComputedStyle(btn);
                    if (styles.display === 'none' || styles.visibility === 'hidden' || styles.opacity === '0') {
                        console.log('[Offchat] Button hidden, making visible...');
                        btn.style.display = 'inline-flex';
                        btn.style.visibility = 'visible';
                        btn.style.opacity = '1';
                    }

                    // Try to relocate if not next to share button
                    const shareBtn = document.querySelector('[data-a-target="share-button"]');
                    if (shareBtn && shareBtn.parentNode && shareBtn.nextSibling !== btn) {
                        const currentPos = btn.style.position;
                        // Only relocate if not in fallback fixed position
                        if (currentPos !== 'fixed') {
                            btn.remove();
                            shareBtn.parentNode.insertBefore(btn, shareBtn.nextSibling);
                            console.log('[Offchat] Button relocated to correct position');
                        }
                    }
                }
            }, 1000);
        }, 2000);
    }

    // Global keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ignore if user is typing in an input field
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
            return;
        }

        // Toggle theater mode with 'T' key
        if (e.key === 't' || e.key === 'T') {
            e.preventDefault();
            toggleTheaterMode();
        }

        // Toggle sync mute with 'M' key
        if (e.key === 'm' || e.key === 'M') {
            e.preventDefault();
            toggleSyncMute();
        }

        // Toggle control panel with 'P' key
        if (e.key === 'p' || e.key === 'P') {
            e.preventDefault();
            if (controlPanel) {
                if (controlPanel.style.display === 'none') {
                    controlPanel.style.display = 'block';
                    const showBtn = document.getElementById('offchat-show-btn');
                    if (showBtn) showBtn.style.display = 'none';
                } else {
                    controlPanel.style.display = 'none';
                    createShowButton();
                }
            }
        }

        // Focus streams with number keys 1-4
        if (['1', '2', '3', '4'].includes(e.key)) {
            e.preventDefault();
            const index = parseInt(e.key) - 1;
            if (index < openStreams.length) {
                toggleStreamFocus(index);
            }
        }

        // Close all streams with Shift+X
        if (e.shiftKey && (e.key === 'x' || e.key === 'X')) {
            e.preventDefault();
            if (openStreams.length > 0) {
                if (confirm(`Close all ${openStreams.length} stream(s)?`)) {
                    removeStreamContainer();
                    updateControlPanel();
                }
            }
        }

        // Switch to stream viewer mode with 'S'
        if (e.key === 's' || e.key === 'S') {
            e.preventDefault();
            currentPanelMode = 'stream';
            if (controlPanel) updateControlPanel();
        }

        // Switch to chat viewer mode with 'C'
        if (e.key === 'c' || e.key === 'C') {
            e.preventDefault();
            currentPanelMode = 'chat';
            if (controlPanel) updateControlPanel();
        }

        // Return to grid mode with 'G'
        if (e.key === 'g' || e.key === 'G') {
            e.preventDefault();
            if (focusedStreamIndex !== null) {
                focusedStreamIndex = null;
                renderStreamContainer();
            }
        }

        // Toggle main stream hide with 'H' key
        if (e.key === 'h' || e.key === 'H') {
            e.preventDefault();
            toggleMainStreamHide();
        }
    });

    // Also handle fullscreen change events (user presses ESC)
    document.addEventListener('fullscreenchange', () => {
        // If user exits fullscreen manually, also exit theater mode
        if (!document.fullscreenElement && isTheaterMode) {
            isTheaterMode = false;
            if (theaterModeStyle && theaterModeStyle.parentNode) {
                theaterModeStyle.remove();
                theaterModeStyle = null;
            }
            // Wait for Twitch UI to reappear before re-rendering
            setTimeout(() => {
                if (streamContainer) {
                    renderStreamContainer();
                }
            }, 100);
            if (controlPanel) {
                updateControlPanel();
            }
        }

        // If a stream exits fullscreen, re-render to fix dimensions
        if (!document.fullscreenElement && streamContainer && !isTheaterMode) {
            setTimeout(() => {
                if (streamContainer) {
                    renderStreamContainer();
                }
            }, 100);
        }
    });

    let lastUrl = location.href;

    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            const newChannel = getCurrentChannel();

            if (newChannel !== lastChannel) {
                cleanup();
                lastChannel = newChannel;
                setTimeout(init, 1500);
            } else if (newChannel) {
                // Tab switched on same channel - recreate button
                console.log('[Offchat] Tab changed, ensuring button exists');
                setTimeout(() => {
                    const btn = document.getElementById('offchat-show-btn');
                    if (!btn || !document.body.contains(btn)) {
                        createShowButton();
                    } else {
                        // Button exists but might be in wrong place, try to relocate
                        const shareBtn = document.querySelector('[data-a-target="share-button"]');
                        if (shareBtn && shareBtn.parentNode && !shareBtn.parentNode.contains(btn)) {
                            btn.remove();
                            createShowButton();
                        }
                    }
                }, 1500);
            }
        }
    }).observe(document, { subtree: true, childList: true });

    GM_registerMenuCommand('Clear Recent Streams', () => {
        config.lastStreams = [];
        GM_setValue('lastStreams', []);
        updateControlPanel();
    });

    GM_registerMenuCommand('Show Panel', () => {
        if (controlPanel) {
            controlPanel.style.display = 'block';
            const showBtn = document.getElementById('offchat-show-btn');
            if (showBtn) showBtn.style.display = 'none';
        }
    });

    GM_registerMenuCommand('Toggle Theater Mode (T)', () => {
        toggleTheaterMode();
    });

    GM_registerMenuCommand('Toggle Sync Mute (M)', () => {
        toggleSyncMute();
    });

    GM_registerMenuCommand('Show Keyboard Shortcuts', () => {
        const shortcuts = `
Keyboard Shortcuts:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

T - Toggle Theater Mode
M - Toggle Sync Mute All
P - Toggle Control Panel
G - Return to Grid Mode

1-4 - Focus Stream 1-4
Shift+X - Close All Streams

S - Switch to Stream Viewer
C - Switch to Chat Viewer

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        `;
        alert(shortcuts);
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();