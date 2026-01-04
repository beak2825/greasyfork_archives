// ==UserScript==
// @name         Forum post notifier
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  notifies you :P
// @author       aquagloop
// @match        *://*.torn.com/*
// @connect      api.torn.com
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/548731/Forum%20post%20notifier.user.js
// @updateURL https://update.greasyfork.org/scripts/548731/Forum%20post%20notifier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CHECK_INTERVAL = 60000; // 60 seconds

    function setApiKey() {
        let currentKey = GM_getValue('tornApiKey', '');
        let newKey = prompt("Please enter your Torn API key:", currentKey);
        if (newKey && newKey.trim() !== '') {
            GM_setValue('tornApiKey', newKey.trim());
            alert('API Key saved! The page will now reload.');
            location.reload();
        } else if (newKey === '') {
            alert('API Key cannot be empty.');
        }
    }
    GM_registerMenuCommand('Set Forum Notifier API Key', setApiKey);


    const styles = `
        #tm-forum-update-box {
            position: fixed;
            top: 10px;
            left: 10px;
            width: 160px; 
            max-height: 250px; 
            background-color: #ffffff;
            border: 1px solid #ddd;
            border-radius: 4px; /* Sharper corners */
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
            z-index: 9999;
            display: flex;
            flex-direction: column;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
            pointer-events: none;
            resize: none;
            overflow: hidden;
        }
        #tm-forum-update-box.visible { opacity: 1; transform: translateY(0); pointer-events: auto; }
        #tm-forum-update-box .header {
            padding: 5px 8px; 
            background-color: #e9ecef;
            border-bottom: 1px solid #ddd;
            font-weight: bold;
            color: #495057;
            font-size: 12px; 
            cursor: move;
            user-select: none;
            touch-action: none;
        }
        #tm-forum-update-box .thread-list { list-style: none; padding: 0; margin: 0; overflow-y: auto; flex-grow: 1; }
        #tm-forum-update-box .thread-list a {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 6px 6px; 
            text-decoration: none;
            color: #0056b3;
            border-bottom: 1px solid #f0f2f5;
            transition: background-color 0.2s;
            font-size: 12px;
        }
        #tm-forum-update-box .thread-list a:hover { background-color: #f8f9fa; }
        #tm-forum-update-box .thread-title { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; padding-right: 6px; }
        #tm-forum-update-box .new-posts-count {
            background-color: #dc3545;
            color: white;
            border-radius: 10px;
            padding: 1px 6px;
            font-size: 10px;
            font-weight: bold;
            flex-shrink: 0;
        }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);


    const boxHtml = `<div id="tm-forum-update-box"><div class="header">New Posts</div><ul class="thread-list"></ul></div>`; 
    document.body.insertAdjacentHTML('beforeend', boxHtml);
    const updateBox = document.getElementById('tm-forum-update-box');
    const header = updateBox.querySelector('.header');
    const threadList = updateBox.querySelector('.thread-list');


    const fetchAndUpdate = (apiKey) => {
        const API_URL = `https://api.torn.com/v2/user/forumsubscribedthreads?key=${apiKey}`;
        GM_xmlhttpRequest({
            method: "GET", url: API_URL,
            onload: (response) => {
                const data = JSON.parse(response.responseText);
                if (data.error) {
                    console.error(`Torn API Error: ${data.error.error}`);
                    threadList.innerHTML = `<li><a href="#">API Error: ${data.error.error}</a></li>`;
                    if (!updateBox.classList.contains('visible')) updateBox.classList.add('visible');
                    return;
                }
                if (data.forumSubscribedThreads) {
                    const threadsWithNewPosts = data.forumSubscribedThreads.filter(t => t.posts.new > 0);
                    updateDisplay(threadsWithNewPosts);
                }
            },
            onerror: (error) => console.error("Tampermonkey HTTP Request Error:", error)
        });
    };

    const updateDisplay = (newThreads) => {
        threadList.innerHTML = '';
        if (newThreads.length > 0) {
            newThreads.forEach(thread => {
                const threadUrl = `https://www.torn.com/forums.php#/p=threads&f=${thread.forum_id}&t=${thread.id}&to=${thread.posts.total}`;
                threadList.insertAdjacentHTML('beforeend', `<li><a href="${threadUrl}" target="_blank" rel="noopener noreferrer"><span class="thread-title" title="${thread.title}">${thread.title}</span><span class="new-posts-count">${thread.posts.new}</span></a></li>`);
            });
            if (!updateBox.classList.contains('visible')) updateBox.classList.add('visible');
        } else {
            if (updateBox.classList.contains('visible')) updateBox.classList.remove('visible');
        }
    };



    const savedPos = JSON.parse(GM_getValue('forumBoxPosition', null));
    if (savedPos) {
        updateBox.style.top = savedPos.top;
        updateBox.style.left = savedPos.left;
    }

    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    header.addEventListener('mousedown', dragStart);
    header.addEventListener('touchstart', dragStart);

    function dragStart(e) {
        if (e.type === 'touchstart') {
            pos3 = e.touches[0].clientX;
            pos4 = e.touches[0].clientY;
            document.addEventListener('touchend', dragEnd, { once: true });
            document.addEventListener('touchmove', elementDrag);
        } else {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.addEventListener('mouseup', dragEnd, { once: true });
            document.addEventListener('mousemove', elementDrag);
        }
    }

    function elementDrag(e) {
        let clientX, clientY;
        if (e.type === 'touchmove') {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            e.preventDefault();
            clientX = e.clientX;
            clientY = e.clientY;
        }
        pos1 = pos3 - clientX;
        pos2 = pos4 - clientY;
        pos3 = clientX;
        pos4 = clientY;
        updateBox.style.top = (updateBox.offsetTop - pos2) + "px";
        updateBox.style.left = (updateBox.offsetLeft - pos1) + "px";
    }

    function dragEnd() {
        document.removeEventListener('mouseup', dragEnd);
        document.removeEventListener('mousemove', elementDrag);
        document.removeEventListener('touchend', dragEnd);
        document.removeEventListener('touchmove', elementDrag);
        savePosition();
    }

    function savePosition() {
        const newPos = {
            top: updateBox.style.top,
            left: updateBox.style.left
        };
        GM_setValue('forumBoxPosition', JSON.stringify(newPos));
    }



    const userApiKey = GM_getValue('tornApiKey', null);
    if (!userApiKey) {
        setApiKey();
    } else {
        fetchAndUpdate(userApiKey);
        setInterval(() => fetchAndUpdate(userApiKey), CHECK_INTERVAL);
    }
})();