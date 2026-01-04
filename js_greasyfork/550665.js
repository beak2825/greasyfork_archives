// ==UserScript==
// @name         DRAWARIA EASY SPAM
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Лёгкий спам, вы можете получить временный мут за использование этого скрипта!
// @author       Silly Cat
// @match        https://drawaria.online/*
// @grant        GM_setClipboard
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/550665/DRAWARIA%20EASY%20SPAM.user.js
// @updateURL https://update.greasyfork.org/scripts/550665/DRAWARIA%20EASY%20SPAM.meta.js
// ==/UserScript==

(function() {
    'use strict';


    function makeDraggable(el) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        el.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            el.style.top = (el.offsetTop - pos2) + "px";
            el.style.left = (el.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }


    const menu = document.createElement('div');
    Object.assign(menu.style, {
        position: 'fixed',
        top: '20px',
        left: '20px',
        background: '#2c2c44',
        padding: '20px',
        borderRadius: '15px',
        boxShadow: '0 0 20px rgba(0,0,0,0.7)',
        zIndex: '9999',
        textAlign: 'center'
    });
    makeDraggable(menu);

    const title = document.createElement('h3');
    title.textContent = 'Auto-Chat';
    title.style.color = '#fff';
    menu.appendChild(title);


    const label = document.createElement('label');
    label.textContent = 'Интервал (мс, рекомендовано 700): ';
    label.style.color = '#fff';
    menu.appendChild(label);

    const intervalInput = document.createElement('input');
    intervalInput.type = 'number';
    intervalInput.value = '700';
    intervalInput.style.width = '60px';
    intervalInput.style.margin = '5px';
    menu.appendChild(intervalInput);
    menu.appendChild(document.createElement('br'));


    const startBtn = document.createElement('button');
    startBtn.textContent = 'Start';
    Object.assign(startBtn.style, {
        margin: '5px',
        padding: '10px',
        border: 'none',
        borderRadius: '10px',
        background: '#4cafef',
        color: 'white',
        cursor: 'pointer'
    });
    menu.appendChild(startBtn);


    const stopBtn = document.createElement('button');
    stopBtn.textContent = 'Stop';
    Object.assign(stopBtn.style, {
        margin: '5px',
        padding: '10px',
        border: 'none',
        borderRadius: '10px',
        background: '#f44336',
        color: 'white',
        cursor: 'pointer'
    });
    menu.appendChild(stopBtn);
    menu.appendChild(document.createElement('br'));


    const updatesBtn = document.createElement('button');
    updatesBtn.textContent = 'Updates';
    Object.assign(updatesBtn.style, {
        margin: '5px',
        padding: '10px',
        border: 'none',
        borderRadius: '10px',
        background: '#ff9800',
        color: 'white',
        cursor: 'pointer'
    });
    menu.appendChild(updatesBtn);

    document.body.appendChild(menu);


    const updatesMenu = document.createElement('div');
    Object.assign(updatesMenu.style, {
        position: 'fixed',
        top: '100px',
        left: '100px',
        background: '#444',
        padding: '15px',
        borderRadius: '15px',
        boxShadow: '0 0 20px rgba(0,0,0,0.7)',
        zIndex: '9999',
        color: '#fff',
        display: 'none'
    });

    const updatesTitle = document.createElement('h4');
    updatesTitle.textContent = 'Обновления:';
    updatesMenu.appendChild(updatesTitle);
    const updatesList = document.createElement('ul');
    const items = [
        'Добавлен выбор интервала в мс',
        'Меню теперь можно перетаскивать',
        'Кнопка Updates открывает это окно',
        'Интервал можно менять на лету',
        'Временно Интервал НЕ РАБОТАЕТ'
    ];
    items.forEach(text => {
        const li = document.createElement('li');
        li.textContent = text;
        updatesList.appendChild(li);
    });
    updatesMenu.appendChild(updatesList);

    makeDraggable(updatesMenu);
    document.body.appendChild(updatesMenu);

    updatesBtn.addEventListener('click', () => {
        updatesMenu.style.display = updatesMenu.style.display === 'none' ? 'block' : 'none';
    });


    let chatInterval = null;
    let currentInterval = 655

    const messages = [
        '𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫𒐫',

    ];

    function sendMessage() {
        const chatInput = document.getElementById('chatbox_textinput');
        if (!chatInput) return;
        const msg = messages[Math.floor(Math.random() * messages.length)];
        chatInput.value = msg;
        chatInput.dispatchEvent(new Event('input', { bubbles: true }));
        chatInput.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'Enter',
            code: 'Enter',
            keyCode: 13,
            bubbles: true
        }));
        console.log('Message sent:', msg);
    }

    function startAutoChat() {
        stopAutoChat();
        let interval = parseInt(intervalInput.value, 10);
        if (isNaN(interval) || interval < 100) interval = 700;
        currentInterval = interval;
        chatInterval = setInterval(sendMessage, currentInterval);

    }

    function stopAutoChat() {
        if (chatInterval) {
            clearInterval(chatInterval);
            chatInterval = null;
            console.log('Auto-chat stopped!');
        }
    }

    startBtn.addEventListener('click', startAutoChat);
    stopBtn.addEventListener('click', stopAutoChat);


    intervalInput.addEventListener('input', () => {
        if (chatInterval) startAutoChat();
    });

})();