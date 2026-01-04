// ==UserScript==
// @name         iDNSChat Mod
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Bypass message send delay and send anything 
// @author       Josh
// @match        *://idnschat.com/*
// @grant        none
// @icon         https://idnschat.com/icons/favicon-96x96.png
// @downloadURL https://update.greasyfork.org/scripts/559079/iDNSChat%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/559079/iDNSChat%20Mod.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const textarea = document.querySelector('textarea#message');
    if (textarea) {
        textarea.id = 'message';
        textarea.className = 'message';
        textarea.maxLength = 99999;
    }

    const style = document.createElement('style');
    style.innerHTML = `
        .messages .messages-auto-layout {
            background-size: cover;
        }
        .messages {




            display: -webkit-box;
            display: -ms-flexbox;
            display: -webkit-flex;
            display: flex;
            -webkit-box-orient: vertical;
            -moz-box-orient: vertical;
            -ms-flex-direction: column;
            -webkit-flex-direction: column;
            flex-direction: column;
            position: relative; /* Ensure the overlay is positioned correctly */
            background-color:#000;

        }
        .messages-date {
            text-align: center;
            font-weight: 500;
            font-size: 11px;
            line-height: 1;
            margin: 10px 15px;
            color: #fff;
        }
        .messagebar textarea {
            background: #000;
            color: #f00;
        }
        html.ios-gt-8 .messages-date {
            font-weight: 600;
        }
        .messages-date span {
            font-weight: 400;
        }
        .message {
            box-sizing: border-box;
            margin: 1px 10px 0;
            max-width: 70%;
            display: -webkit-box;
            display: -ms-flexbox;
            display: -webkit-flex;
            display: flex;
            -webkit-box-orient: vertical;
            -moz-box-orient: vertical;
            -ms-flex-direction: column;
            -webkit-flex-direction: column;
            flex-direction: column;
        }
        .message:first-child {
            margin-top: 10px;
        }
        .message .message-text {
            box-sizing: border-box;
            border-radius: 16px;
            padding: 6px 16px 9px;
            min-width: 48px;
            min-height: 35px;
            font-size: 17px;
            line-height: 1.2;
            word-break: break-word;
        }
        .message .message-text img {
            max-width: 100%;
            height: auto;
        }
        .message.message-pic .message-text {
            padding: 0;
            background: 0 0;
        }
        .message.message-pic img {
            display: block;
            border-radius: 16px;
        }
        .message-name {
            font-size: 12px;
            line-height: 1;
            color: #8e8e93;
            margin-bottom: 2px;
            margin-top: 7px;
        }
        .message-hide-name .message-name {
            display: none;
        }
        .message-label {
            font-size: 12px;
            line-height: 1;
            color: #fff;
            margin-top: 4px;
        }
        .message-hide-label .message-label {
            display: none;
        }
        .message-avatar {
            width: 29px;
            height: 29px;
            border-radius: 100%;
            margin-top: -29px;
            position: relative;
            top: 1px;
            background-size: cover;
            opacity: 1;
            -webkit-transition-duration: .4s;
            transition-duration: .4s;
        }
        .message-hide-avatar .message-avatar {
            opacity: 0;
        }
        .message-date {
            font-size: 12px;
            margin-top: 4px;
            opacity: .8;
        }
        .message-pic img + .message-date {
            margin-top: 8px;
        }
        .message-sent .message-date {
            text-align: right;
        }
        .message-sent {
            -ms-flex-item-align: end;
            -webkit-align-self: flex-end;
            align-self: flex-end;
            -webkit-box-align: end;
            -ms-flex-align: end;
            -webkit-align-items: flex-end;
            align-items: flex-end;
            color: #fff;
        }
        .message-sent .message-name {
            margin-right: 16px;
            color: #f0a1be;
        }
        .message-sent .message-label {
            margin-right: 6px;
            color: ffa3d1;
        }
        .message-sent.message-with-avatar .message-text {
            margin-right: 29px;
        }
        .message-sent.message-with-avatar .message-name {
            margin-right: 45px;
        }
        .message-sent.message-with-avatar .message-label {
            margin-right: 34px;
        }
        .message-sent .message-text {
            padding-right: 22px;
            background-color: #0f0f0f;
            color: #001aff;
            margin-left: auto;
            opacity: 0.80;
            -webkit-mask-box-image: url("data:image/svg+xml;charset=utf-8,<svg height='35' viewBox='0 0 96 70' width='48' xmlns='http://www.w3.org/2000/svg'><path d='m84 35c1 7-5 37-42 35-37 2-43-28-42-35-1-7 5-37 42-35 37-2 43 28 42 35z'/></svg>") 50% 56% 46% 42%;
        }
        .message-sent.message-last .message-text,
        .message-sent.message-with-tail .message-text {
            border-radius: 16px 16px 0 16px;
            -webkit-mask-box-image: url("data:image/svg+xml;charset=utf-8,<svg height='35' viewBox='0 0 96 70' width='48' xmlns='http://www.w3.org/2000/svg'><path d='m84 35c1 7-5 37-42 35-37 2-43-28-42-35-1-7 5-37 42-35 37-2 43 28 42 35z'/><path d='m96 70c-6-2-12-10-12-19v-16l-14 27s8 8 26 8z'/></svg>") 50% 56% 46% 42%;
        }
        .message-sent.message-last.message-pic img,
        .message-sent.message-with-tail.message-pic img {
            border-radius: 16px 16px 0 16px;
        }
        .message-received {
            -ms-flex-item-align: start;
            -webkit-align-self: flex-start;
            align-self: flex-start;
            -webkit-box-align: start;
            -ms-flex-align: start;
            -webkit-align-items: flex-start;
            align-items: flex-start;
        }
        .message-received .message-text {
            padding-left: 22px;
            background-color: #0f0f0f;
            color: #a7ff24;
            opacity: 0.80;
            -webkit-mask-box-image: url("data:image/svg+xml;charset=utf-8,<svg height='35' viewBox='0 0 96 70' width='48' xmlns='http://www.w3.org/2000/svg'><path d='m96 35c1 7-5 37-42 35-37 2-43-28-42-35-1-7 5-37 42-35 37-2 43 28 42 35z'/></svg>") 50% 42% 46% 56%;
        }
        .message-received .message-name {
            margin-left: 16px;
            color: #00fffb;
        }
        .message-received .message-label {
            margin-left: 6px;
            color: #ffa3d1;
        }
        .message-received.message-with-avatar .message-text {
            margin-left: 29px;
        }
        .message-received.message-with-avatar .message-name {
            margin-left: 45px;
        }
        .message-received.message-with-avatar .message-label {
            margin-left: 34px;
        }
        .message-received.message-last .message-text,
        .message-received.message-with-tail .message-text {
            border-radius: 16px 16px 16px 0;
            -webkit-mask-box-image: url("data:image/svg+xml;charset=utf-8,<svg height='35' viewBox='0 0 96 70' width='48' xmlns='http://www.w3.org/2000/svg'><path d='m96 35c1 7-5 37-42 35-37 2-43-28-42-35-1-7 5-37 42-35 37-2 43 28 42 35z'/><path d='m0 70c6-2 12-10 12-19v-16l14 27s-8 8-26 8z'/></svg>") 50% 42% 46% 56%;
        }
        .message-received.message-last.message-pic img,
        .message-received.message-with-tail.message-pic img {
            border-radius: 16px 16px 16px 0;
        }
        .message-last {
            margin-bottom: 8px;
        }
        .message-appear-from-bottom {
            -webkit-animation: messageAppearFromBottom .4s;
            animation: messageAppearFromBottom .4s;
        }
        .message-appear-from-top {
            -webkit-animation: messageAppearFromTop .4s;
            animation: messageAppearFromTop .4s;
        }
        .messages-auto-layout .message-label,
        .messages-auto-layout .message-name {
            display: none;
        }
        .messages-auto-layout .message-avatar {
            opacity: 0;
        }
        .messages-auto-layout .message-first .message-name {
            display: block;
        }
        .messages-auto-layout .message-last .message-avatar {
            opacity: 1;
        }
        .messages-auto-layout .message-last .message-label {
            display: block;
        }
        .layout-dark .navbar, .layout-dark .subnavbar, .navbar.layout-dark, .subnavbar.layout-dark {
          color: #f00;
          opacity: 0.9;
        }
    `;
    document.head.appendChild(style);

    const popoverInner = document.querySelector('.popover-inner .content-block');
    if (popoverInner) {
        popoverInner.innerHTML = '';
    }

    const iframe = document.createElement('iframe');
    iframe.src = 'https://idnschat.com/idns_test';
    iframe.style.width = '260px';
    iframe.style.height = '300px';
    iframe.style.border = 'none';
    popoverInner.appendChild(iframe);
    const toggleContainer = document.createElement('div');
    toggleContainer.innerHTML = `
        <font size="3"> <label for="bypassFilter">Enable Chat Bypass</label>
        <input type="checkbox" id="bypassFilter">
        <br>
        <font size="3"> <label for="changeUserAgent">Change User Agent</label>
        <input type="checkbox" id="changeUserAgent">
    `;
    popoverInner.appendChild(toggleContainer);

    const messageTextarea = document.querySelector('textarea#message');
    if (messageTextarea) {
        const bypassFilterCheckbox = document.getElementById('bypassFilter');
        bypassFilterCheckbox.addEventListener('change', function() {
            if (bypassFilterCheckbox.checked) {
                messageTextarea.addEventListener('input', function() {
                    const text = messageTextarea.value;
                    const words = text.split(' ');
                    const joinedWords = words.map(word => word + '\u2060').join(' ');
                    messageTextarea.value = joinedWords;
                });
            } else {
                messageTextarea.removeEventListener('input', function() {
                    const text = messageTextarea.value;
                    const joinedText = text.split('\u2060').join('');
                    messageTextarea.value = joinedText;
                });
            }
        });

        messageTextarea.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                const text = messageTextarea.value;
                const words = text.split(' ');
                const joinedWords = words.map(word => word + '\u2060').join(' ');
                messageTextarea.value = joinedWords;
                const sendButton = document.querySelector('.messagebar .send');
                if (sendButton) {
                    sendButton.click();
                }
            }
        });

        messageTextarea.addEventListener('keydown', function(event) {
            if (event.key === 'Backspace') {
                const text = messageTextarea.value;
                const words = text.split(' ');
                const joinedWords = words.map(word => word.replace('\u2060', '')).join(' ');
                messageTextarea.value = joinedWords;
            }
        });
    }

    const changeUserAgentCheckbox = document.getElementById('changeUserAgent');
    changeUserAgentCheckbox.addEventListener('change', function() {
        if (changeUserAgentCheckbox.checked) {
            Object.defineProperty(navigator, 'userAgent', {
                value: 'Mozilla/5.0 (iPad; CPU OS 10_2 like Mac OS X) AppleWebKit/602.3.12 (KHTML, like Gecko) Version/10.0 Mobile/14C92 Safari/602.1',
                writable: true
            });
        } else {
            Object.defineProperty(navigator, 'userAgent', {
                value: navigator.userAgent,
                writable: true
            });
        }
    });
})();