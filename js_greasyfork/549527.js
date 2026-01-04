// ==UserScript==
// @name         Accessible Telegram Web
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Improves Telegram Web accessibility for screen reader users with UI fixes and feature enhancements.
// @author       mahmood hozhabri
// @match        https://web.telegram.org/a/*
// @grant        GM_info
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/549527/Accessible%20Telegram%20Web.user.js
// @updateURL https://update.greasyfork.org/scripts/549527/Accessible%20Telegram%20Web.meta.js
// ==/UserScript==
(function() {
'use strict';

// Simulates a universal click by dispatching multiple event types to ensure reliability.
function simulateUniversalClick(element) {
    if (!element) return;
    const isTouchDevice = 'ontouchstart' in window;

    if (isTouchDevice) {
        element.dispatchEvent(new TouchEvent('touchstart', { bubbles: true, cancelable: true, view: window }));
        element.dispatchEvent(new TouchEvent('touchend', { bubbles: true, cancelable: true, view: window }));
    }

    element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window }));
    element.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window }));
    element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
}

// =========================================================================
// SECTION: Unified Live Region for Announcements
// ... (All other functions from before remain the same)
// ...
// =========================================================================
let unifiedLiveRegion;
let currentChatStatusText = '';
let lastAnnouncedMessageId = null;
let announcementTimeout = null;
let isInitialPageLoad = true;

// Initializes the visually hidden live region element.
function createUnifiedLiveRegion() {
    if (unifiedLiveRegion) return;
    unifiedLiveRegion = document.createElement('div');
    unifiedLiveRegion.setAttribute('aria-live', 'polite');
    unifiedLiveRegion.setAttribute('aria-atomic', 'true');
    unifiedLiveRegion.style.cssText = 'position: absolute; left: -9999px; top: -9999px; width: 1px; height: 1px; overflow: hidden;';
    document.body.appendChild(unifiedLiveRegion);
}

// Sends text to the live region to be announced by a screen reader.
function announceText(text, isMessage = false) {
    if (!unifiedLiveRegion) return;

    if (announcementTimeout) {
        clearTimeout(announcementTimeout);
        announcementTimeout = null;
    }

    if (!text.trim()) {
        if (unifiedLiveRegion.textContent.trim() !== '' && !unifiedLiveRegion.dataset.isAnnouncingMessage) {
             unifiedLiveRegion.textContent = '';
        }
        return;
    }

    if (isMessage) {
        unifiedLiveRegion.dataset.isAnnouncingMessage = 'true';
        unifiedLiveRegion.textContent = text;
        announcementTimeout = setTimeout(() => {
            if (unifiedLiveRegion.textContent === text) {
                unifiedLiveRegion.textContent = currentChatStatusText ? `User status: ${currentChatStatusText}` : '';
                delete unifiedLiveRegion.dataset.isAnnouncingMessage;
            }
        }, 3000);
    } else {
        delete unifiedLiveRegion.dataset.isAnnouncingMessage;
        if (unifiedLiveRegion.textContent !== `User status: ${text}`) {
            unifiedLiveRegion.textContent = `User status: ${text}`;
        }
    }
}

let statusObserverInstance = null;
let currentObservedChatInfoContainer = null;
let statusUpdateDebounceTimeout = null;

// Monitors the chat header for status changes (e.g., "online", "typing") and announces them.
function monitorChatStatus() {
    const chatInfoContainer = document.querySelector('.ChatInfo .info');

    if (!chatInfoContainer) {
        if (statusObserverInstance) {
            statusObserverInstance.disconnect();
            statusObserverInstance = null;
            currentObservedChatInfoContainer = null;
        }
        currentChatStatusText = '';
        announceText('');
        return;
    }

    if (chatInfoContainer === currentObservedChatInfoContainer) {
        return;
    }

    if (statusObserverInstance) {
        statusObserverInstance.disconnect();
    }

    const extractStatusText = (element) => {
        const commonExclusions = ['last seen', 'ago', 'connecting', 'updating', 'synchronizing', 'subscriber', 'member', 'bot', 'monthly users'];

        const checkAndFilter = (text) => {
            if (!text) return '';
            const lowerText = text.toLowerCase();
            for (const exclusion of commonExclusions) {
                if (lowerText.includes(exclusion)) {
                    return '';
                }
            }
            return text;
        };

        const typingStatusElem = element.querySelector('p.typing-status');
        if (typingStatusElem && typingStatusElem.textContent.trim()) {
            const text = typingStatusElem.textContent.trim().replace(/\.{3}$/, '');
            return checkAndFilter(text);
        }

        const userStatusSpan = element.querySelector('.status .user-status');
        if (userStatusSpan && userStatusSpan.textContent.trim()) {
            const text = userStatusSpan.textContent.trim();
            return checkAndFilter(text);
        }

        const generalStatusElem = element.querySelector('.status');
        if (generalStatusElem && generalStatusElem.textContent.trim()) {
            const text = generalStatusElem.textContent.trim();
            const fullNameElem = element.querySelector('.fullName');
            const fullNameText = fullNameElem ? fullNameElem.textContent.trim() : '';
            if (text !== fullNameText) {
                return checkAndFilter(text);
            }
        }
        return '';
    };

    const updateStatusAnnouncement = () => {
        const newStatusText = extractStatusText(chatInfoContainer);
        if (newStatusText !== currentChatStatusText) {
            currentChatStatusText = newStatusText;
            if (currentChatStatusText.trim()) {
                announceText(currentChatStatusText);
            } else {
                announceText('');
            }
        }
    };

    updateStatusAnnouncement();

    statusObserverInstance = new MutationObserver((mutations) => {
        const relevantChange = mutations.some(mutation =>
            mutation.target === chatInfoContainer ||
            (mutation.target.parentElement === chatInfoContainer && (
                mutation.target.matches('p.typing-status') || mutation.target.matches('.status')
            )) ||
            (mutation.type === 'characterData' && mutation.target.parentElement && (
                mutation.target.parentElement.matches('p.typing-status') ||
                mutation.target.parentElement.matches('.status') ||
                mutation.target.parentElement.closest('p.typing-status') ||
                mutation.target.parentElement.closest('.status .user-status')
            ))
        );

        if (relevantChange) {
            if (statusUpdateDebounceTimeout) clearTimeout(statusUpdateDebounceTimeout);
            statusUpdateDebounceTimeout = setTimeout(updateStatusAnnouncement, 50);
        }
    });

    currentObservedChatInfoContainer = chatInfoContainer;
    const observerOptions = { childList: true, subtree: true, characterData: true };
    statusObserverInstance.observe(chatInfoContainer, observerOptions);
}

// =========================================================================
// SECTION: Chat List Processing
// ...
// (The function processChatList is unchanged)
function processChatList() {
    const chats = document.querySelectorAll('#LeftColumn .ListItem.Chat');
    chats.forEach(chat => {
        const link = chat.querySelector('a.ListItem-button');
        if (!link) return;

        const nameElem = chat.querySelector('.fullName'),
              timeElem = chat.querySelector('.time'),
              messageElem = chat.querySelector('.last-message-summary'),
              senderElem = chat.querySelector('.sender-name'),
              unreadBadge = chat.querySelector('.ChatBadge.unread .tgKbsVmz');

        if (!nameElem || !timeElem || !messageElem ||
            !nameElem.textContent.trim() ||
            !timeElem.textContent.trim() ||
            !messageElem.textContent.trim()) {
            return;
        }

        const name = nameElem.textContent.trim();
        const time = timeElem.textContent.trim();
        const message = messageElem.textContent.trim();
        const sender = senderElem ? senderElem.textContent.trim() : '';
        const unreadCount = unreadBadge ? unreadBadge.textContent.trim() : '';
        let chatTypePrefix = '';

        if (chat.classList.contains('private')) {
            chatTypePrefix = `${name}. `;
        } else if (chat.classList.contains('forum') || senderElem) {
            chatTypePrefix = `Group: ${name}. `;
        } else {
            chatTypePrefix = `Channel: ${name}. `;
        }

        let ariaLabel = chatTypePrefix;
        if (unreadCount) ariaLabel += `${unreadCount} unread messages. `;
        ariaLabel += sender ? `from ${sender}: ${message}. ` : `${message}. `;
        ariaLabel += `${time}.`;

        const lastState = chat.getAttribute('data-last-state-signature');
        if (lastState !== ariaLabel) {
            link.setAttribute('aria-label', ariaLabel);
            chat.setAttribute('data-last-state-signature', ariaLabel);
        }
    });
}
// =========================================================================
// SECTION: Custom Accessible Menus
// ...
// (The functions createAccessibleMenu and showAccessibleContextMenu are unchanged)
function createAccessibleMenu(title, items) {
    const existingMenu = document.getElementById('accessible-context-menu');
    if (existingMenu) existingMenu.remove();

    const overlay = document.createElement('div');
    overlay.id = 'accessible-context-menu';
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background-color: rgba(0, 0, 0, 0.5); z-index: 9999;
        display: flex; justify-content: center; align-items: center;
    `;

    const menu = document.createElement('div');
    menu.setAttribute('role', 'dialog');
    menu.setAttribute('aria-modal', 'true');
    menu.setAttribute('aria-label', title);
    menu.style.cssText = `
        background-color: white; color: black; border-radius: 12px;
        padding: 10px; max-width: 80%; box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    `;

    const menuList = document.createElement('ul');
    menuList.style.cssText = 'list-style: none; padding: 0; margin: 0;';

    items.forEach(item => {
        const listItem = document.createElement('li');
        const button = document.createElement('button');
        button.textContent = item.text;
        button.style.cssText = `
            width: 100%; padding: 12px 16px; border: none; background: none;
            text-align: left; font-size: 17px; cursor: pointer;
            color: ${item.isDestructive ? '#ff3b30' : '#007aff'};
            ${item.disabled ? 'color: #8e8e93; cursor: not-allowed;' : ''}
        `;
        if (!item.disabled) {
            button.onclick = () => {
                item.action();
                if (!item.keepMenuOpen) {
                    overlay.remove();
                }
            };
        }
        listItem.appendChild(button);
        menuList.appendChild(listItem);
    });

    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.style.cssText = `
        width: 100%; padding: 12px 16px; border: none; background-color: #f0f0f0;
        border-radius: 8px; margin-top: 10px; font-size: 17px; font-weight: bold;
        color: #007aff; cursor: pointer;
    `;
    cancelButton.onclick = () => overlay.remove();

    menu.appendChild(menuList);
    menu.appendChild(cancelButton);
    overlay.appendChild(menu);
    document.body.appendChild(overlay);

    const firstButton = menu.querySelector('button');
    if (firstButton) firstButton.focus();

    overlay.onclick = (e) => {
        if (e.target === overlay) {
            overlay.remove();
        }
    };
}

function showAccessibleContextMenu(nativeMenuItems, title) {
    const nativeMenuBackdrop = document.querySelector('.Menu.in-portal .backdrop');
    if (nativeMenuBackdrop) {
        nativeMenuBackdrop.click();
    }

    const menuTitle = title || 'Actions';
    const items = Array.from(nativeMenuItems).map(item => ({
        text: item.textContent.trim(),
        action: () => simulateUniversalClick(item),
        isDestructive: item.classList.contains('destructive'),
        disabled: false
    })).filter(item => item.text);

    if (items.length > 0) {
        createAccessibleMenu(menuTitle, items);
    }
}
// =========================================================================
// SECTION: Delegated Event Listeners
// ...
// (All Delegated Event Listener functions are unchanged)
function addDelegatedChatListListeners() {
    const leftColumn = document.getElementById('LeftColumn');
    if (!leftColumn || leftColumn.hasAttribute('data-delegated-chat-listeners-added')) {
        return;
    }

    let longPressTimer;
    let wasLongPress = false;
    let touchStartX = 0;
    let touchStartY = 0;
    const LONG_PRESS_THRESHOLD = 10;
    const LONG_PRESS_DELAY = 500;

    const getTargetChat = (event) => event.target.closest('.ListItem.Chat');

    const showMenu = (chat, clientX, clientY) => {
        if (!chat) return;
        chat.dispatchEvent(new MouseEvent('contextmenu', {
            bubbles: true, cancelable: true, view: window, clientX, clientY
        }));
        setTimeout(() => {
            const nativeMenuItems = document.querySelectorAll('.ListItem-context-menu .MenuItem');
            if (nativeMenuItems.length > 0) {
                showAccessibleContextMenu(nativeMenuItems, 'Chat Actions');
            }
        }, 50);
    };

    leftColumn.addEventListener('touchstart', (event) => {
        const targetChat = getTargetChat(event);
        if (!targetChat) return;

        wasLongPress = false;
        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;

        longPressTimer = setTimeout(() => {
            wasLongPress = true;
            showMenu(targetChat, touchStartX, touchStartY);
        }, LONG_PRESS_DELAY);
    }, { passive: true });

    leftColumn.addEventListener('touchmove', (event) => {
        if (!longPressTimer) return;
        const deltaX = Math.abs(event.touches[0].clientX - touchStartX);
        const deltaY = Math.abs(event.touches[0].clientY - touchStartY);
        if (deltaX > LONG_PRESS_THRESHOLD || deltaY > LONG_PRESS_THRESHOLD) {
            clearTimeout(longPressTimer);
            longPressTimer = null;
        }
    }, { passive: true });

    leftColumn.addEventListener('touchend', (event) => {
        if (longPressTimer) {
            clearTimeout(longPressTimer);
            longPressTimer = null;
        }
        if (wasLongPress) {
            event.preventDefault();
        }
    });

    leftColumn.addEventListener('contextmenu', (e) => {
        const targetChat = getTargetChat(e);
        if (!targetChat) return;
        e.preventDefault();
        e.stopPropagation();
        showMenu(targetChat, e.clientX, e.clientY);
    });

    leftColumn.setAttribute('data-delegated-chat-listeners-added', 'true');
}

function addDelegatedMessageListeners() {
    const messageList = document.querySelector('.MessageList.custom-scroll');
    if (!messageList || messageList.hasAttribute('data-delegated-listeners-added')) {
        return;
    }

    let longPressTimer;
    let wasLongPress = false;
    let touchStartX = 0;
    let touchStartY = 0;
    const LONG_PRESS_DELAY = 500;
    const TOUCH_MOVE_THRESHOLD = 10;

    const getTargetMessage = (event) => event.target.closest('.Message');

    messageList.addEventListener('touchstart', (event) => {
        const targetMessage = getTargetMessage(event);
        if (!targetMessage) return;

        wasLongPress = false;
        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;

        longPressTimer = setTimeout(() => {
            wasLongPress = true;
            targetMessage.dispatchEvent(new MouseEvent('contextmenu', {
                bubbles: true, cancelable: true, view: window,
                clientX: touchStartX, clientY: touchStartY
            }));
            setTimeout(() => {
                const nativeMenuItems = document.querySelectorAll('.ContextMenuContainer .MenuItem');
                if (nativeMenuItems.length > 0) {
                    showAccessibleContextMenu(nativeMenuItems, 'Message Actions');
                }
            }, 50);
        }, LONG_PRESS_DELAY);
    }, { passive: true });

    messageList.addEventListener('touchmove', (event) => {
        if (!longPressTimer) return;
        const deltaX = Math.abs(event.touches[0].clientX - touchStartX);
        const deltaY = Math.abs(event.touches[0].clientY - touchStartY);
        if (deltaX > TOUCH_MOVE_THRESHOLD || deltaY > TOUCH_MOVE_THRESHOLD) {
            clearTimeout(longPressTimer);
            longPressTimer = null;
        }
    }, { passive: true });

    messageList.addEventListener('touchend', (event) => {
        if (longPressTimer) {
            clearTimeout(longPressTimer);
            longPressTimer = null;
        }
        if (wasLongPress) {
            event.preventDefault();
        }
    });

    messageList.addEventListener('contextmenu', (e) => {
        const targetMessage = getTargetMessage(e);
        if (!targetMessage) return;

        e.preventDefault();
        e.stopPropagation();

        targetMessage.dispatchEvent(new MouseEvent('contextmenu', {
            bubbles: true, cancelable: true, view: window,
            clientX: e.clientX, clientY: e.clientY
        }));

        setTimeout(() => {
            const nativeMenuItems = document.querySelectorAll('.ContextMenuContainer .MenuItem');
            if (nativeMenuItems.length > 0) showAccessibleContextMenu(nativeMenuItems, 'Message Actions');
        }, 50);
    });

    messageList.setAttribute('data-delegated-listeners-added', 'true');
}

function showAudioPlayerMenu() {
    const audioPlayer = document.querySelector('.AudioPlayer');
    if (!audioPlayer) return;

    const playPauseBtn = audioPlayer.querySelector('.toggle-play');
    const prevBtn = audioPlayer.querySelector('.player-button[aria-label="Previous track"]');
    const nextBtn = audioPlayer.querySelector('.player-button[aria-label="Next track"]');
    const rateBtn = audioPlayer.querySelector('.playback-button');
    const closeBtn = audioPlayer.querySelector('.player-close');

    const createRefreshAction = (element) => () => {
        if (element) simulateUniversalClick(element);
        setTimeout(showAudioPlayerMenu, 150);
    };

    const items = [{
        text: playPauseBtn && playPauseBtn.classList.contains('pause') ? 'Pause' : 'Play',
        action: createRefreshAction(playPauseBtn),
        disabled: !playPauseBtn,
        keepMenuOpen: true
    }, {
        text: 'Previous Track',
        action: createRefreshAction(prevBtn),
        disabled: !prevBtn || prevBtn.classList.contains('disabled'),
        keepMenuOpen: true
    }, {
        text: 'Next Track',
        action: createRefreshAction(nextBtn),
        disabled: !nextBtn || nextBtn.classList.contains('disabled'),
        keepMenuOpen: true
    }, {
        text: `Playback Rate (${rateBtn ? rateBtn.textContent.trim() : '1X'})`,
        action: createRefreshAction(rateBtn),
        disabled: !rateBtn,
        keepMenuOpen: true
    }, {
        text: 'Close Player',
        action: () => simulateUniversalClick(closeBtn),
        disabled: !closeBtn,
        isDestructive: true
    }];

    createAccessibleMenu('Player Controls', items);
}
// =========================================================================
// SECTION: Message Processing
// ...
// (All Message Processing functions are unchanged)
function handleAudioMessage(message, isVoice) {
    const originalContentWrapper = message.querySelector('.message-content-wrapper');
    if (!originalContentWrapper || message.querySelector('[data-accessible-audio-heading="true"]')) {
        return;
    }

    const playButton = message.querySelector('.Button.toggle-play');
    if (!playButton) return;

    const textContentElem = message.querySelector('.text-content');
    let captionText = '';
    const extractedLinks = [];
    if (textContentElem) {
        const clone = textContentElem.cloneNode(true);
        clone.querySelectorAll('.Reactions, .MessageMeta').forEach(el => el.remove());
        clone.querySelectorAll('img.emoji, .custom-emoji').forEach(emojiEl => {
            const altText = emojiEl.alt || emojiEl.dataset.alt;
            if (altText) emojiEl.parentNode.replaceChild(document.createTextNode(altText), emojiEl);
        });
        captionText = clone.innerText.trim();
        textContentElem.querySelectorAll('a').forEach(link => extractedLinks.push(link));
    }

    const accessibleHeading = document.createElement('div');
    accessibleHeading.setAttribute('role', 'heading');
    accessibleHeading.setAttribute('aria-level', '3');
    accessibleHeading.setAttribute('tabindex', '0');
    accessibleHeading.setAttribute('data-accessible-audio-heading', 'true');
    accessibleHeading.style.cssText = 'padding: 12px 16px; cursor: pointer; font-size: 1rem; border: 1px solid transparent; border-radius: 8px; margin: 2px;';
    accessibleHeading.onfocus = () => accessibleHeading.style.borderColor = '#3390ec';
    accessibleHeading.onblur = () => accessibleHeading.style.borderColor = 'transparent';

    const senderTitleElem = message.querySelector('.message-title .sender-title');
    const sender = senderTitleElem ? `From ${senderTitleElem.textContent.trim()}.` : (message.classList.contains('own') ? 'Your message.' : '');

    let label, text;

    const controlsContainer = document.createElement('div');
    controlsContainer.setAttribute('role', 'toolbar');
    controlsContainer.setAttribute('aria-label', 'Audio Message Options');
    controlsContainer.style.cssText = 'margin-top: 8px; display: flex; flex-wrap: wrap; gap: 8px; z-index: 6; position: relative;';


    if (isVoice) {
        const voiceDurationElem = message.querySelector('.voice-duration');
        const duration = (voiceDurationElem && voiceDurationElem.textContent.trim()) || '';
        const timeElem = message.querySelector('.message-time');
        const time = (timeElem && timeElem.textContent.trim()) || '';
        label = `${sender} Voice message. ${duration ? `Duration: ${duration}.` : ''} ${captionText ? `Caption: ${captionText}.` : ''} ${time ? `Time: ${time}.` : ''} Double tap to play and open player controls.`;
        text = `Voice message (${duration})`;
        accessibleHeading.setAttribute('aria-label', label);
        accessibleHeading.textContent = text;
        accessibleHeading.onclick = (e) => {
            e.stopPropagation();
            simulateUniversalClick(playButton);
            setTimeout(showAudioPlayerMenu, 150);
        };
        message.insertBefore(accessibleHeading, originalContentWrapper);
    } else { // Music
        const songTitleElem = message.querySelector('.Audio .title');
        const songTitle = (songTitleElem && songTitleElem.textContent.trim()) || 'Untitled';
        const performerElem = message.querySelector('.Audio .performer');
        const performer = (performerElem && performerElem.textContent.trim()) || 'Unknown Artist';
        const durationElem = message.querySelector('.Audio .duration');
        const duration = (durationElem && durationElem.textContent.trim());
        label = `Music file. ${performer} - ${songTitle}. ${duration ? `Duration: ${duration}.` : ''} ${captionText ? `Caption: ${captionText}.` : ''} Double tap to play and open player controls.`;
        text = `Music: ${songTitle}`;

        accessibleHeading.setAttribute('aria-label', label);
        accessibleHeading.textContent = text;
        accessibleHeading.onclick = (e) => {
            e.stopPropagation();
            simulateUniversalClick(playButton);
            setTimeout(showAudioPlayerMenu, 150);
        };
        message.insertBefore(accessibleHeading, originalContentWrapper);

        const originalDownloadContainer = message.querySelector('.Audio .download-button');
        if (originalDownloadContainer) {
            const newDownloadButton = document.createElement('button');

            const updateButtonState = () => {
                const isDownloading = originalDownloadContainer.querySelector('.Progress, .spinner-container');
                const nativeCancelButton = originalDownloadContainer.querySelector('.cancel-button, .icon-close');

                if (isDownloading || nativeCancelButton) {
                    newDownloadButton.textContent = 'Cancel';
                    newDownloadButton.onclick = (e) => {
                        e.stopPropagation();
                        if (nativeCancelButton) simulateUniversalClick(nativeCancelButton);
                    };
                } else {
                    newDownloadButton.textContent = `Download ${performer} - ${songTitle}`;
                    newDownloadButton.onclick = (e) => {
                        e.stopPropagation();
                        simulateUniversalClick(originalDownloadContainer);
                    };
                }
            };
            updateButtonState();
            const observer = new MutationObserver(updateButtonState);
            observer.observe(originalDownloadContainer, { childList: true, subtree: true, attributes: true });

            controlsContainer.appendChild(newDownloadButton);
        }
    }

    if (extractedLinks.length > 0) {
        extractedLinks.forEach(link => {
            const newLinkAnchor = document.createElement('a');
            newLinkAnchor.textContent = link.textContent.trim() || link.href;
            newLinkAnchor.href = link.href;
            newLinkAnchor.target = '_blank';
            newLinkAnchor.rel = 'noopener noreferrer';
            newLinkAnchor.style.cssText = 'padding: 8px 12px; background-color: #f0f0f0; border: 1px solid #ddd; border-radius: 8px; text-decoration: none; color: #007aff;';
            controlsContainer.appendChild(newLinkAnchor);
        });
    }

    if (controlsContainer.hasChildNodes()) {
        message.insertBefore(controlsContainer, accessibleHeading.nextSibling);
    }

    originalContentWrapper.querySelectorAll('button, a, [role="button"]').forEach(el => {
        el.setAttribute('aria-hidden', 'true');
        el.setAttribute('tabindex', '-1');
    });

    message.setAttribute('data-accessible-message', 'true');

    if (!isInitialPageLoad) {
        const announceLabel = accessibleHeading.getAttribute('aria-label');
        if (announceLabel) {
            announceText(announceLabel, true);
        }
    }
}

function processMessages() {
    const messages = document.querySelectorAll('.Message:not([data-accessible-message="true"])');
    messages.forEach(message => {
        const isVoice = !!message.querySelector('.message-content.voice');
        const isMusic = !!message.querySelector('.Audio.inline');
        if (isVoice || isMusic) {
            handleAudioMessage(message, isVoice);
            return;
        }

        const messageContentWrapper = message.querySelector('.message-content-wrapper');
        if (!messageContentWrapper) return;

        message.style.display = 'flex';
        message.style.flexDirection = 'column';
        message.style.alignItems = 'flex-start';

        const overlay = document.createElement('div');
        overlay.setAttribute('role', 'heading');
        overlay.setAttribute('aria-level', '3');
        overlay.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 5; cursor: pointer;';

        const labelParts = [];

        const stickerImage = message.querySelector('.sticker-image');
        const gifMedia = message.querySelector('.message-media-gif, .media-inner.is-document.is-animated');

        if (stickerImage) {
            const emojiEl = stickerImage.closest('.Message').querySelector('.emoji-small');
            const stickerEmoji = emojiEl ? emojiEl.alt || emojiEl.textContent.trim() : '';
            let stickerLabel = 'Sticker';
            if (stickerEmoji) {
                stickerLabel += `: ${stickerEmoji}`;
            }
            labelParts.push(stickerLabel);
            stickerImage.setAttribute('aria-label', stickerLabel);
            stickerImage.setAttribute('alt', stickerLabel);
        } else if (gifMedia) {
            let gifLabel = 'Animated GIF';
            const messageTextElem = message.querySelector('.message-text');
            const caption = (messageTextElem && messageTextElem.textContent.trim()) || '';
            if (caption) {
                gifLabel += `: ${caption}`;
            }
            labelParts.push(gifLabel);
            const mediaElement = gifMedia.querySelector('img, video');
            if (mediaElement) {
                mediaElement.setAttribute('aria-label', gifLabel);
                mediaElement.setAttribute('alt', gifLabel);
            }
        }

        const isOwnMessage = message.classList.contains('own');
        if (isOwnMessage) {
            labelParts.push('Your message.');
        } else {
            const senderTitleElem = message.querySelector('.message-title .sender-title');
            const isForwarded = !!message.querySelector('.message-title-wrapper .label');
            if (senderTitleElem) {
                labelParts.push(isForwarded ? `Forwarded from ${senderTitleElem.textContent.trim()}.` : `From ${senderTitleElem.textContent.trim()}.`);
            }
        }

        const textContentElem = message.querySelector('.text-content');
        if (textContentElem) {
            const clone = textContentElem.cloneNode(true);
            clone.querySelectorAll('.Reactions, .MessageMeta').forEach(el => el.remove());
            clone.querySelectorAll('img.emoji, .custom-emoji').forEach(emojiEl => {
                const altText = emojiEl.alt || emojiEl.dataset.alt;
                if (altText) emojiEl.parentNode.replaceChild(document.createTextNode(altText), emojiEl);
            });
            const cleanText = clone.innerText.trim();
            if (cleanText) labelParts.push(cleanText);
        }

        const controlsContainer = document.createElement('div');
        controlsContainer.setAttribute('role', 'toolbar');
        controlsContainer.setAttribute('aria-label', 'Message Options');
        controlsContainer.style.cssText = 'margin-top: 8px; display: flex; flex-wrap: wrap; gap: 8px; z-index: 6; position: relative;';

        if (textContentElem) {
            textContentElem.querySelectorAll('a').forEach(link => {
                const newLinkAnchor = document.createElement('a');
                newLinkAnchor.textContent = link.textContent.trim() || link.href;
                newLinkAnchor.href = link.href;
                newLinkAnchor.target = '_blank';
                newLinkAnchor.rel = 'noopener noreferrer';
                controlsContainer.appendChild(newLinkAnchor);
            });
        }

        const replyHeader = message.querySelector('.message-subheader .EmbeddedMessage');
        if (replyHeader) {
            const embeddedSenderElem = replyHeader.querySelector('.embedded-sender');
            const sender = (embeddedSenderElem && embeddedSenderElem.textContent.trim());
            const embeddedTextElem = replyHeader.querySelector('.embedded-text-wrapper');
            const text = (embeddedTextElem && embeddedTextElem.textContent.trim());
            let replyLabel = "In reply to";
            if (sender) replyLabel += ` message from ${sender}`;
            if (text) replyLabel += `: ${text}`;
            labelParts.push(`${replyLabel}.`);
        }

        message.querySelectorAll('.InlineButtons .Button, .reply-markup .Button').forEach(button => {
            const buttonText = button.textContent.trim();
            if (buttonText) {
                const newInlineButton = document.createElement('button');
                newInlineButton.textContent = `Button: ${buttonText}`;
                newInlineButton.onclick = (e) => { e.stopPropagation(); simulateUniversalClick(button); };
                controlsContainer.appendChild(newInlineButton);
            }
        });

        const originalForwardButton = message.querySelector('.message-action-button[aria-label="Forward"]');
        if (originalForwardButton) {
            const newForwardButton = document.createElement('button');
            newForwardButton.textContent = 'Forward';
            newForwardButton.onclick = (e) => { e.stopPropagation(); simulateUniversalClick(originalForwardButton); };
            controlsContainer.appendChild(newForwardButton);
        }

        const originalCommentButton = message.querySelector('.CommentButton');
        if (originalCommentButton) {
            const newCommentButton = document.createElement('button');
            const commentCount = originalCommentButton.getAttribute('data-cnt');
            const labelElem = originalCommentButton.querySelector('.label');
            const labelText = (labelElem && labelElem.textContent.trim());
            let buttonText;

            if (labelText && labelText.toLowerCase().includes('leave a comment')) {
                buttonText = 'Leave a comment';
            } else if (commentCount && parseInt(commentCount, 10) > 0) {
                buttonText = `${commentCount} ${parseInt(commentCount, 10) === 1 ? 'comment' : 'comments'}`;
            } else {
                buttonText = 'Comments';
            }

            newCommentButton.textContent = buttonText;
            newCommentButton.onclick = (e) => {
                e.stopPropagation();
                simulateUniversalClick(originalCommentButton);
            };
            controlsContainer.appendChild(newCommentButton);
        }

        const album = message.querySelector('.Album');
        const fileInfo = message.querySelector('.File');

        if (album) {
            const items = Array.from(album.querySelectorAll('.media-inner'));
            let photoCount = 0, videoCount = 0;
            items.forEach(item => {
                if (item.querySelector('video, .message-media-duration')) videoCount++;
                else photoCount++;
            });
            let albumDescription = `Album with ${items.length} items`;
            if (photoCount > 0) albumDescription += `: ${photoCount} photos`;
            if (videoCount > 0) albumDescription += `${photoCount > 0 ? ' and' : ':'} ${videoCount} videos`;
            albumDescription += '.';

            let currentIndex = 0;
            const getSelectedItemType = () => (items[currentIndex] && items[currentIndex].querySelector('video, .message-media-duration')) ? 'Video' : 'Photo';
            const updateMediaFocus = () => {
                items.forEach((item, index) => item.style.outline = index === currentIndex ? '3px solid #3390ec' : 'none');
                const currentItemLabel = `Item ${currentIndex + 1} of ${items.length}: ${getSelectedItemType()}.`;
                overlay.setAttribute('aria-label', `${currentItemLabel} ${albumDescription} \n${labelParts.join(' \n')}`);
            };
            overlay.onclick = (e) => { e.stopPropagation(); if (items[currentIndex]) simulateUniversalClick(items[currentIndex]); };
            const prevButton = document.createElement('button');
            prevButton.textContent = 'Previous Media';
            prevButton.onclick = () => { currentIndex = (currentIndex - 1 + items.length) % items.length; updateMediaFocus(); };
            controlsContainer.appendChild(prevButton);
            const nextButton = document.createElement('button');
            nextButton.textContent = 'Next Media';
            nextButton.onclick = () => { currentIndex = (currentIndex + 1) % items.length; updateMediaFocus(); };
            controlsContainer.appendChild(nextButton);
            updateMediaFocus();
        } else if (fileInfo) {
            labelParts.unshift("File.");
            const fileNameElem = fileInfo.querySelector('.file-title');
            const fileName = (fileNameElem && fileNameElem.textContent.trim());
            const fileSizeElem = fileInfo.querySelector('.file-subtitle');
            const fileSize = (fileSizeElem && fileSizeElem.textContent.trim());
            if (fileName) labelParts.push(`File name: ${fileName}.`);
            if (fileSize) labelParts.push(`File size: ${fileSize}.`);
            const downloadTrigger = fileInfo.querySelector('.file-icon-container');
            if (downloadTrigger) {
                overlay.onclick = (e) => { e.stopPropagation(); simulateUniversalClick(downloadTrigger); };
                const clone = downloadTrigger.cloneNode(true);
                clone.removeAttribute('aria-hidden');
                clone.setAttribute('tabindex', '0');
                clone.setAttribute('role', 'button');
                clone.setAttribute('aria-label', `Download ${fileName || 'file'}`);
                clone.style.position = 'relative';
                clone.onclick = (e) => { e.stopPropagation(); simulateUniversalClick(downloadTrigger); };
                controlsContainer.appendChild(clone);
            }
        } else {
            const hasVideoIndicator = message.querySelector('video, .message-media-duration, .icon-large-play');
            const mediaContainer = message.querySelector('.media-inner');
            const hasPhotoIndicator = mediaContainer && !hasVideoIndicator;
            if (hasVideoIndicator) labelParts.unshift("Video.");
            else if (hasPhotoIndicator) labelParts.unshift("Photo.");

            if (mediaContainer) {
                overlay.onclick = (e) => {
                    e.stopPropagation();
                    const interactiveMedia = message.querySelector('.media-inner.interactive');
                    if (interactiveMedia) simulateUniversalClick(interactiveMedia);
                };
            }
        }

        const timeElem = message.querySelector('.message-time');
        if (timeElem) {
            let metaText = `Time: ${timeElem.textContent.trim()}.`;
            if (isOwnMessage) {
                const statusIcon = message.querySelector('.MessageOutgoingStatus i');
                if (statusIcon) {
                    if (statusIcon.classList.contains('icon-message-read')) metaText += ' Status: Read.';
                    else if (statusIcon.classList.contains('icon-message-succeeded')) metaText += ' Status: Sent, not yet seen.';
                    else if (statusIcon.classList.contains('icon-clock')) metaText += ' Status: Sending.';
                    else if (statusIcon.classList.contains('icon-error')) metaText += ' Status: Failed to send.';
                }
            }
            labelParts.push(metaText);
        }

        const viewsElem = message.querySelector('.message-views');
        if (viewsElem) labelParts.push(`${viewsElem.textContent.trim()} views.`);

        if (!album) {
            overlay.setAttribute('aria-label', labelParts.join(' \n'));
        }
        messageContentWrapper.style.position = 'relative';
        messageContentWrapper.appendChild(overlay);
        if (controlsContainer.hasChildNodes()) message.appendChild(controlsContainer);

        const allInnerElements = messageContentWrapper.querySelectorAll('button, a, [role="button"], input, .Reactions, .sticker-image, .message-media-gif, .media-inner.is-document.is-animated');
        allInnerElements.forEach(el => {
            if (el !== overlay && el.closest('.message-content-wrapper') === messageContentWrapper) {
                el.setAttribute('aria-hidden', 'true');
                el.setAttribute('tabindex', '-1');
            }
        });

        overlay.removeAttribute('aria-hidden');
        overlay.setAttribute('tabindex', '0');
        message.setAttribute('data-accessible-message', 'true');

        if (!isInitialPageLoad) {
            const messageList = document.querySelector('.MessageList.custom-scroll');
            const allVisibleMessages = messageList ? Array.from(messageList.querySelectorAll('.Message:not(.service-message)')) : [];
            const latestMessage = allVisibleMessages[allVisibleMessages.length - 1];

            if (latestMessage === message && labelParts.length > 0) {
                const announcementText = labelParts.join(' \n');
                const messageId = message.id || message.dataset.messageId;

                if (messageId && messageId !== lastAnnouncedMessageId) {
                    announceText(announcementText, true);
                    lastAnnouncedMessageId = messageId;
                } else if (!messageId && announcementText !== unifiedLiveRegion.textContent) {
                    announceText(announcementText, true);
                    lastAnnouncedMessageId = null;
                }
            }
        }
    });
}
// =========================================================================
// SECTION: Other UI Processors
// =========================================================================

// NEW FUNCTION to handle confirmation dialogs like the delete message dialog
function processConfirmDialog() {
    const dialog = document.querySelector('.ConfirmDialog');
    if (!dialog || dialog.hasAttribute('data-accessible-dialog')) {
        return;
    }

    const titleElem = dialog.querySelector('h3');
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');

    if (titleElem && !dialog.hasAttribute('aria-labelledby')) {
        const titleId = 'dialog-title-' + Date.now();
        titleElem.id = titleId;
        dialog.setAttribute('aria-labelledby', titleId);
    }

    const checkbox = dialog.querySelector('input[type="checkbox"]');
    if (checkbox) {
        const label = checkbox.closest('label');
        if (label && !checkbox.hasAttribute('aria-label')) {
            const labelText = label.textContent.trim();
            if (labelText) {
                checkbox.setAttribute('aria-label', labelText);
            }
        }
    }

    dialog.setAttribute('data-accessible-dialog', 'true');

    // Set focus to the first interactive element (checkbox or delete button)
    const elementToFocus = checkbox || dialog.querySelector('.Button.danger');
    if (elementToFocus) {
        setTimeout(() => elementToFocus.focus(), 100);
    }
}

function processForwardList() {
    const forwardModal = document.querySelector('.Modal.ChatOrUserPicker');
    if (!forwardModal) return;
    const items = forwardModal.querySelectorAll('.ChatOrUserPicker-item:not([data-accessible-forward-item="true"])');
    items.forEach(item => {
        const nameElem = item.querySelector('.fullName');
        const subtitleElem = item.querySelector('.OYmzCSp2');
        if (!nameElem) return;

        const name = nameElem.textContent.trim();
        const subtitle = subtitleElem ? subtitleElem.textContent.trim() : '';
        const subtitleLower = subtitle.toLowerCase();
        const avatar = item.querySelector('.Avatar');
        let itemTypePrefix = '';

        if (avatar && avatar.classList.contains('saved-messages')) itemTypePrefix = '';
        else if (subtitleLower.includes('subscriber')) itemTypePrefix = `Channel: ${name}. `;
        else if (subtitleLower.includes('member') || (avatar && avatar.classList.contains('forum'))) itemTypePrefix = `Group: ${name}. `;
        else if (subtitleLower.includes('bot')) itemTypePrefix = `Bot: ${name}. `;
        else if (subtitleLower.includes('last seen') || subtitleLower.includes('online') || subtitleLower.includes('monthly users') || (avatar && avatar.classList.contains('private'))) itemTypePrefix = `Chat with ${name}. `;
        else if (subtitle) itemTypePrefix = `Group: ${name}. `;
        else itemTypePrefix = `Chat with ${name}. `;

        const newLabel = itemTypePrefix ? `${itemTypePrefix}${subtitle}` : `${name}. ${subtitle}`;
        item.setAttribute('aria-label', newLabel);
        item.setAttribute('data-accessible-forward-item', 'true');
    });
}

function processSearchResults() {
    const searchContainer = document.querySelector('.LeftSearch--content');
    if (!searchContainer) return;
    const items = searchContainer.querySelectorAll('.ListItem.search-result .ListItem-button:not([data-accessible-search-item="true"])');
    items.forEach(item => {
        const nameElem = item.querySelector('.fullName');
        const statusElem = item.querySelector('.status');
        if (!nameElem || !statusElem) return;
        const name = nameElem.textContent.trim();
        const statusText = statusElem.textContent.trim();
        const statusTextLower = statusText.toLowerCase();
        let typePrefix = '';
        if (statusTextLower.includes('subscriber')) typePrefix = `Channel: ${name}. `;
        else if (statusTextLower.includes('member')) typePrefix = `Group: ${name}. `;
        else if (statusTextLower.includes('bot')) typePrefix = `Bot: ${name}. `;
        else if (statusTextLower.includes('last seen') || statusTextLower.includes('online')) typePrefix = `User: ${name}. `;
        else typePrefix = `${name}. `;
        const ariaLabel = `${typePrefix}${statusText}`;
        item.setAttribute('aria-label', ariaLabel);
        item.setAttribute('data-accessible-search-item', 'true');
    });
}

// =========================================================================
// SECTION: Settings Accessibility
// ...
// (The function processSettings is unchanged)
let settingsHeaderIdCounter = 0;

function processSettings() {
    // Target only the currently visible settings page
    const activeSettingsContent = document.querySelector('#Settings .Transition_slide-active .settings-content');
    if (!activeSettingsContent) return;

    // Group items with headers (like Data and Storage sections)
    const settingItems = activeSettingsContent.querySelectorAll('.settings-item:not([data-accessible-group="true"])');
    settingItems.forEach(item => {
        const header = item.querySelector('h4.settings-item-header');
        if (header) {
            const headerId = `settings-header-${settingsHeaderIdCounter++}`;
            header.id = headerId;
            item.setAttribute('role', 'group');
            item.setAttribute('aria-labelledby', headerId);

            // Process checkboxes within this group
            item.querySelectorAll('label.Checkbox').forEach(label => {
                const input = label.querySelector('input[type="checkbox"]');
                const span = label.querySelector('span.label');
                if (input && span && !input.hasAttribute('aria-label')) {
                    const fullLabel = `${header.textContent.trim()}: ${span.textContent.trim()}`;
                    input.setAttribute('aria-label', fullLabel);
                }
            });

            // Process range sliders within this group
            const rangeSlider = item.querySelector('.RangeSlider');
            if (rangeSlider) {
                const rangeInput = rangeSlider.querySelector('input[type="range"]');
                const rangeLabel = rangeSlider.querySelector('.slider-top-row .label');
                const rangeValue = rangeSlider.querySelector('.slider-top-row .value');
                if (rangeInput && rangeLabel && !rangeInput.hasAttribute('aria-label')) {
                    rangeInput.setAttribute('aria-label', rangeLabel.textContent.trim());
                }
                if (rangeInput && rangeValue) {
                    rangeInput.setAttribute('aria-valuetext', rangeValue.textContent.trim());
                }
            }
        }
        item.setAttribute('data-accessible-group', 'true');
    });

    // Process simple navigation list items in settings (main settings page)
    const simpleItems = activeSettingsContent.querySelectorAll('.ListItem:not([data-accessible-setting="true"]) .ListItem-button');
    simpleItems.forEach(button => {
        // Only process if it doesn't have a checkbox inside, to avoid duplication.
        if (button.querySelector('input[type="checkbox"]')) return;

        const textContent = button.textContent.trim();
        const currentValueElem = button.querySelector('.settings-item__current-value');
        if (currentValueElem) {
            const currentValue = currentValueElem.textContent.trim();
            const baseText = textContent.replace(currentValue, '').trim();
            button.setAttribute('aria-label', `${baseText}: ${currentValue}`);
        }
        button.closest('.ListItem').setAttribute('data-accessible-setting', 'true');
    });
}
// =========================================================================
// Other utility functions are unchanged
// ...
function processUnreadDivider() {
    const unreadDividers = document.querySelectorAll('.unread-divider:not([role="heading"])');
    unreadDividers.forEach(divider => {
        divider.setAttribute('role', 'heading');
        divider.setAttribute('aria-level', '2');
        divider.setAttribute('tabindex', '0');
    });
}

function cleanupExtraButtons() {
    const selectToolbar = document.querySelector('.MessageSelectToolbar');
    if (selectToolbar && !selectToolbar.hasAttribute('data-hidden-by-script')) {
        selectToolbar.setAttribute('aria-hidden', 'true');
        selectToolbar.setAttribute('data-hidden-by-script', 'true');
    }
    const mentionButton = document.querySelector('button[aria-label="Go to next mention"]');
    if (mentionButton) mentionButton.parentElement.setAttribute('aria-hidden', 'true');
    const reactionButton = document.querySelector('button[aria-label="Go to next unread reactions"]');
    if (reactionButton) reactionButton.parentElement.setAttribute('aria-hidden', 'true');
}

function hideInvisibleElements() {
    const cloneInput = document.querySelector('.custom-scroll.input-scroller.clone');
    if (cloneInput && !cloneInput.hasAttribute('aria-hidden')) {
        cloneInput.setAttribute('aria-hidden', 'true');
        cloneInput.setAttribute('tabindex', '-1');
    }

    const placeholderTextElem = document.querySelector('#message-input-text .placeholder-text');
    if (placeholderTextElem && !placeholderTextElem.hasAttribute('aria-hidden')) {
        placeholderTextElem.setAttribute('aria-hidden', 'true');
        placeholderTextElem.setAttribute('tabindex', '-1');
    }
}

function addVideoViewerToggleListener() {
    document.body.addEventListener('click', function(event) {
        const mediaViewer = event.target.closest('#MediaViewer');
        if (!mediaViewer) return;
        if (event.target.closest('.VideoPlayer') && !event.target.closest('.VideoPlayerControls')) {
            const video = mediaViewer.querySelector('video#media-viewer-video');
            if (video) video.paused ? video.play() : video.pause();
        }
    });
}

function addGoToBottomListener() {
    document.body.addEventListener('click', function(event) {
        const goToBottomButton = event.target.closest('button[aria-label="Go to bottom"]');
        if (!goToBottomButton) return;
        event.preventDefault();
        event.stopPropagation();
        const messageList = document.querySelector('.MessageList.custom-scroll');
        if (messageList) {
            messageList.scrollTo({ top: messageList.scrollHeight, behavior: 'smooth' });
        }
    }, true);
}
// =========================================================================
// SECTION: Main Observer
// =========================================================================
function startObserver() {
    const targetNode = document.getElementById('root');
    if (!targetNode) {
        setTimeout(startObserver, 500);
        return;
    }

    createUnifiedLiveRegion();

    const observer = new MutationObserver((mutationsList) => {
        const processorsToRun = new Set();

        for (const mutation of mutationsList) {
            if (!(mutation.target instanceof Element)) continue;

            if (mutation.target.closest('#LeftColumn')) {
                processorsToRun.add(processChatList);
                processorsToRun.add(addDelegatedChatListListeners);
                processorsToRun.add(processSearchResults);
            }

            if (mutation.target.closest('.MessageList')) {
                processorsToRun.add(processMessages);
                processorsToRun.add(processUnreadDivider);
            }

            if (mutation.target.closest('.Modal.ChatOrUserPicker')) {
                processorsToRun.add(processForwardList);
            }
            
            // MODIFIED: Added a check for the confirmation dialog
            if (mutation.target.closest('.ConfirmDialog')) {
                processorsToRun.add(processConfirmDialog);
            }

            if (mutation.target.closest('.ChatInfo')) {
                processorsToRun.add(monitorChatStatus);
            }

            if (mutation.target.closest('#Settings')) {
                processorsToRun.add(processSettings);
            }

            if (mutation.type === 'childList' && Array.from(mutation.addedNodes).some(node => node instanceof Element && (node.matches('.custom-scroll.input-scroller.clone') || node.matches('.placeholder-text')))) {
                processorsToRun.add(hideInvisibleElements);
            }
        }

        if (processorsToRun.size > 0) {
            if (window.accessibilityTimeout) clearTimeout(window.accessibilityTimeout);
            window.accessibilityTimeout = setTimeout(() => {
                processorsToRun.forEach(processor => processor());
                cleanupExtraButtons();
                hideInvisibleElements();
                if (processorsToRun.has(processMessages)) {
                    addDelegatedMessageListeners();
                }
            }, 250);
        }
    });

    // Added `attributes: true` to detect class changes for settings navigation.
    observer.observe(targetNode, { childList: true, subtree: true, attributes: true });

    addVideoViewerToggleListener();
    addGoToBottomListener();

    // Initial run of all processors on page load.
    setTimeout(() => {
        processChatList();
        addDelegatedChatListListeners();
        isInitialPageLoad = true;
        processMessages();
        addDelegatedMessageListeners();
        processUnreadDivider();
        isInitialPageLoad = false;
        cleanupExtraButtons();
        monitorChatStatus();
        hideInvisibleElements();
        processSettings();
    }, 1000);
}

window.addEventListener('load', startObserver);
})();
