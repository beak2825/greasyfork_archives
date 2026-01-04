// ==UserScript==
// @name         Torn Quick Chat Emoji Picker
// @namespace    http://tampermonkey.net/
// @version      3.3
// @description  Add draggable emoji picker to Torn.com quick chat with working Enter key
// @author       SharmZ
// @match        https://www.torn.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/552865/Torn%20Quick%20Chat%20Emoji%20Picker.user.js
// @updateURL https://update.greasyfork.org/scripts/552865/Torn%20Quick%20Chat%20Emoji%20Picker.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    console.log('Torn Emoji Picker: Script loaded');
 
    // Common emojis
    const emojis = {
        smileys: ['😀','😃','😄','😁','😆','😅','🤣','😂','🙂','🙃','😉','😊','😇','🥰','😍','🤩','😘','😗','😚','😙','🥲','😋','😛','😜','🤪','😝','🤑','🤗','🤭','🤫','🤔','🤐','🤨','😐','😑','😶','😏','😒','🙄','😬','😌','😔','😪','😴','🥱','😷','🤒','🤕','🤢','🤮','🤧','🥵','🥶','😎','🤓','🧐'],
        gestures: ['👍','👎','👌','✌️','🤞','🤟','🤘','🤙','👈','👉','👆','👇','☝️','✋','🤚','🖐️','🖖','👋','🤝','🙏','💪','🦾','🦿','🦵','🦶','👂','🦻','👃','🧠','🦷','🦴','👀','👁️','👅','👄'],
        objects: ['💬','💭','🔥','💯','💢','💥','💫','💦','💨','💣','💤','🎉','🎊','🎁','🎈','🏆','🥇','🥈','🥉','⚽','🏀','🏈','⚾','🎾','🏐','🏉','🎱','🎮','🎯','🎲','🎰','🃏','🀄','🎴']
    };
 
    // CSS for the emoji picker - MORE COMPACT
    const style = document.createElement('style');
    style.textContent = `
        .emoji-picker-container {
            position: relative;
            display: inline-block;
        }
 
        .emoji-picker-btn {
            padding: 4px 8px;
            margin: 0 5px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #fff;
            border: 2px solid #764ba2;
            border-radius: 5px;
            cursor: pointer;
            font-size: 18px;
            line-height: 1;
            vertical-align: middle;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            transition: all 0.2s;
        }
 
        .emoji-picker-btn:hover {
            background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
            transform: scale(1.05);
            box-shadow: 0 3px 8px rgba(0,0,0,0.3);
        }
 
        .emoji-picker-popup {
            position: fixed;
            background: linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%);
            border: 2px solid #667eea;
            border-radius: 8px;
            padding: 0;
            box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
            z-index: 999999;
            width: 280px;
            max-height: 360px;
            display: none;
            overflow: hidden;
        }
 
        .emoji-picker-popup.show {
            display: flex;
            flex-direction: column;
        }
 
        .emoji-picker-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            font-weight: bold;
            padding: 8px 10px;
            font-size: 12px;
            cursor: move;
            user-select: none;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-radius: 6px 6px 0 0;
        }
 
        .emoji-picker-header-title {
            display: flex;
            align-items: center;
            gap: 6px;
        }
 
        .emoji-picker-close {
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            font-size: 18px;
            cursor: pointer;
            width: 22px;
            height: 22px;
            border-radius: 3px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.2s;
        }
 
        .emoji-picker-close:hover {
            background: rgba(255,255,255,0.3);
        }
 
        .emoji-picker-content {
            padding: 8px;
            overflow-y: auto;
            max-height: 310px;
        }
 
        .emoji-picker-content::-webkit-scrollbar {
            width: 6px;
        }
 
        .emoji-picker-content::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 3px;
        }
 
        .emoji-picker-content::-webkit-scrollbar-thumb {
            background: #667eea;
            border-radius: 3px;
        }
 
        .emoji-picker-content::-webkit-scrollbar-thumb:hover {
            background: #764ba2;
        }
 
        .emoji-category {
            margin-bottom: 12px;
        }
 
        .emoji-category:last-child {
            margin-bottom: 0;
        }
 
        .emoji-category-title {
            font-weight: bold;
            margin-bottom: 6px;
            color: #667eea;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            padding-bottom: 3px;
            border-bottom: 1px solid #e9ecef;
        }
 
        .emoji-grid {
            display: grid;
            grid-template-columns: repeat(8, 1fr);
            gap: 3px;
        }
 
        .emoji-item {
            cursor: pointer;
            font-size: 20px;
            text-align: center;
            padding: 4px;
            border-radius: 4px;
            transition: all 0.15s;
            user-select: none;
            background: white;
            border: 1px solid transparent;
        }
 
        .emoji-item:hover {
            background: #667eea;
            transform: scale(1.3);
            z-index: 10;
            box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
            border-color: #764ba2;
        }
 
        .emoji-item:active {
            transform: scale(1.2);
        }
 
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
 
        .emoji-picker-popup.show {
            animation: slideIn 0.15s ease-out;
        }
    `;
    document.head.appendChild(style);
 
    let emojiPicker = null;
    let currentChatInput = null;
    let currentSubmitButton = null;
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };
 
    // LocalStorage keys for position
    const STORAGE_KEY = 'tornEmojiPickerPosition';
 
    // Save position to localStorage
    function savePosition(x, y) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ x: x, y: y }));
        } catch (e) {
            console.log('Torn Emoji Picker: Could not save position', e);
        }
    }
 
    // Load position from localStorage
    function loadPosition() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.log('Torn Emoji Picker: Could not load position', e);
        }
        return null;
    }
 
    function findSubmitButton(chatInput) {
        if (!chatInput) return null;
 
        const parent = chatInput.closest('form, .chat-box, .chat-input, [class*="chat"]');
 
        if (parent) {
            const buttons = parent.querySelectorAll('button, input[type="submit"], a[class*="send"], button[class*="send"]');
            for (let btn of buttons) {
                const text = btn.textContent.toLowerCase();
                const classes = btn.className.toLowerCase();
                const title = (btn.getAttribute('title') || '').toLowerCase();
 
                if (text.includes('send') || text.includes('submit') ||
                    classes.includes('send') || classes.includes('submit') ||
                    title.includes('send') || title.includes('submit')) {
                    return btn;
                }
            }
 
            const nearbyButton = parent.querySelector('button:not(.emoji-picker-btn)');
            if (nearbyButton) {
                return nearbyButton;
            }
        }
 
        let sibling = chatInput.nextElementSibling;
        while (sibling) {
            if (sibling.tagName === 'BUTTON' ||
                (sibling.tagName === 'INPUT' && sibling.type === 'submit')) {
                return sibling;
            }
            sibling = sibling.nextElementSibling;
        }
 
        return null;
    }
 
    function createEmojiPicker() {
        if (emojiPicker) return emojiPicker;
 
        const popup = document.createElement('div');
        popup.className = 'emoji-picker-popup';
        popup.id = 'torn-emoji-picker';
 
        const header = document.createElement('div');
        header.className = 'emoji-picker-header';
 
        const headerTitle = document.createElement('div');
        headerTitle.className = 'emoji-picker-header-title';
        headerTitle.innerHTML = '<span>😊</span><span>Emojis</span>';
 
        const closeBtn = document.createElement('button');
        closeBtn.className = 'emoji-picker-close';
        closeBtn.innerHTML = '×';
        closeBtn.onclick = function(e) {
            e.stopPropagation();
            popup.classList.remove('show');
        };
 
        header.appendChild(headerTitle);
        header.appendChild(closeBtn);
        popup.appendChild(header);
 
        header.addEventListener('mousedown', startDragging);
 
        const content = document.createElement('div');
        content.className = 'emoji-picker-content';
 
        for (const category in emojis) {
            if (emojis.hasOwnProperty(category)) {
                const emojiList = emojis[category];
                const categoryDiv = document.createElement('div');
                categoryDiv.className = 'emoji-category';
 
                const title = document.createElement('div');
                title.className = 'emoji-category-title';
                title.textContent = category;
                categoryDiv.appendChild(title);
 
                const grid = document.createElement('div');
                grid.className = 'emoji-grid';
 
                emojiList.forEach(function(emoji) {
                    const emojiSpan = document.createElement('span');
                    emojiSpan.className = 'emoji-item';
                    emojiSpan.textContent = emoji;
                    emojiSpan.setAttribute('title', emoji);
                    emojiSpan.onclick = function(e) {
                        e.stopPropagation();
                        insertEmoji(emoji);
                    };
                    grid.appendChild(emojiSpan);
                });
 
                categoryDiv.appendChild(grid);
                content.appendChild(categoryDiv);
            }
        }
 
        popup.appendChild(content);
        document.body.appendChild(popup);
        emojiPicker = popup;
 
        return popup;
    }
 
    function startDragging(e) {
        if (e.target.classList.contains('emoji-picker-close')) return;
 
        isDragging = true;
        const rect = emojiPicker.getBoundingClientRect();
        dragOffset.x = e.clientX - rect.left;
        dragOffset.y = e.clientY - rect.top;
 
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDragging);
 
        emojiPicker.style.cursor = 'grabbing';
    }
 
    function drag(e) {
        if (!isDragging) return;
 
        let x = e.clientX - dragOffset.x;
        let y = e.clientY - dragOffset.y;
 
        x = Math.max(0, Math.min(x, window.innerWidth - emojiPicker.offsetWidth));
        y = Math.max(0, Math.min(y, window.innerHeight - emojiPicker.offsetHeight));
 
        emojiPicker.style.left = x + 'px';
        emojiPicker.style.top = y + 'px';
    }
 
    function stopDragging() {
        isDragging = false;
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', stopDragging);
        if (emojiPicker) {
            emojiPicker.style.cursor = '';
            
            // Save the new position
            const rect = emojiPicker.getBoundingClientRect();
            savePosition(rect.left, rect.top);
        }
    }
 
    function insertEmoji(emoji) {
        if (currentChatInput) {
            const start = currentChatInput.selectionStart || 0;
            const end = currentChatInput.selectionEnd || 0;
            const text = currentChatInput.value;
 
            currentChatInput.value = text.substring(0, start) + emoji + text.substring(end);
            const newPosition = start + emoji.length;
            currentChatInput.selectionStart = currentChatInput.selectionEnd = newPosition;
 
            currentChatInput.focus();
 
            const events = ['input', 'change', 'keyup'];
            events.forEach(function(eventType) {
                const event = new Event(eventType, { bubbles: true, cancelable: true });
                currentChatInput.dispatchEvent(event);
            });
        }
    }
 
    function setupEnterKeyHandler(chatInput) {
        if (chatInput.dataset.enterHandlerAdded) return;
 
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                const submitBtn = currentSubmitButton || findSubmitButton(chatInput);
 
                if (submitBtn) {
                    setTimeout(function() {
                        submitBtn.click();
                    }, 0);
                }
            }
        });
 
        chatInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey && e.ctrlKey) {
                e.preventDefault();
                const submitBtn = currentSubmitButton || findSubmitButton(chatInput);
                if (submitBtn) {
                    submitBtn.click();
                }
            }
        });
 
        chatInput.dataset.enterHandlerAdded = 'true';
    }
 
    function addEmojiButton(chatInput) {
        if (!chatInput || chatInput.dataset.emojiAdded) return;
 
        const submitBtn = findSubmitButton(chatInput);
        if (submitBtn) {
            currentSubmitButton = submitBtn;
        }
 
        setupEnterKeyHandler(chatInput);
 
        const container = document.createElement('span');
        container.className = 'emoji-picker-container';
 
        const button = document.createElement('button');
        button.className = 'emoji-picker-btn';
        button.textContent = '😊';
        button.type = 'button';
        button.title = 'Open Emoji Picker';
 
        button.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
 
            currentChatInput = chatInput;
            currentSubmitButton = findSubmitButton(chatInput);
 
            if (!emojiPicker) {
                createEmojiPicker();
            }
 
            const isShown = emojiPicker.classList.contains('show');
            emojiPicker.classList.toggle('show');
 
            if (!isShown) {
                // Try to load saved position first
                const savedPos = loadPosition();
                
                if (savedPos) {
                    // Use saved position, but ensure it's still on screen
                    let x = savedPos.x;
                    let y = savedPos.y;
                    
                    x = Math.max(10, Math.min(x, window.innerWidth - 290));
                    y = Math.max(10, Math.min(y, window.innerHeight - 370));
                    
                    emojiPicker.style.left = x + 'px';
                    emojiPicker.style.top = y + 'px';
                } else {
                    // First time: position near the button
                    const rect = button.getBoundingClientRect();
                    let x = rect.right + 10;
                    let y = rect.top;
 
                    if (x + 280 > window.innerWidth) {
                        x = rect.left - 290;
                    }
 
                    x = Math.max(10, Math.min(x, window.innerWidth - 290));
                    y = Math.max(10, Math.min(y, window.innerHeight - 370));
 
                    emojiPicker.style.left = x + 'px';
                    emojiPicker.style.top = y + 'px';
                    
                    // Save this initial position
                    savePosition(x, y);
                }
            }
        };
 
        container.appendChild(button);
 
        if (chatInput.nextSibling) {
            chatInput.parentNode.insertBefore(container, chatInput.nextSibling);
        } else {
            chatInput.parentNode.appendChild(container);
        }
 
        chatInput.dataset.emojiAdded = 'true';
    }
 
    function findChatInputs() {
        const selectors = [
            'input[name="message"]',
            'input[placeholder*="message" i]',
            'input[placeholder*="chat" i]',
            'textarea[name="message"]',
            'textarea[placeholder*="message" i]',
            '.chat-box-input input',
            '.chat-box-input textarea',
            '#chatInputBox',
            'input[type="text"][class*="chat"]',
            'input[type="text"][class*="message"]'
        ];
 
        selectors.forEach(function(selector) {
            const inputs = document.querySelectorAll(selector);
            inputs.forEach(function(input) {
                if (!input.dataset.emojiAdded) {
                    addEmojiButton(input);
                }
            });
        });
    }
 
    document.addEventListener('click', function(e) {
        if (emojiPicker &&
            !emojiPicker.contains(e.target) &&
            !e.target.classList.contains('emoji-picker-btn')) {
            emojiPicker.classList.remove('show');
        }
    });
 
    function init() {
        findChatInputs();
 
        const observer = new MutationObserver(function() {
            findChatInputs();
        });
 
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
 
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
 
})();