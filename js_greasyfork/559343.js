// ==UserScript==
// @name         Moderator Panel
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Панель модератора с кнопками, VIP, сбросом ника и т. д.
// @match        https://drawaria.online/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559343/Moderator%20Panel.user.js
// @updateURL https://update.greasyfork.org/scripts/559343/Moderator%20Panel.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const bannedPlayers = [];

    function addModeratorMessages(nickname, action, moderatorName='Moderator', suppressMessages=false, suffix='Player') {
        const chatBox = document.getElementById('chatbox_messages');
        if (chatBox) {
            const messageText = suffix ? `${action} ${suffix}` : action;
            const timestamp = Date.now();

            const messageStyle = `class="chatmessage systemchatmessage5" data-ts="${timestamp}"`;

            const messages = [
                `<div ${messageStyle}>${moderatorName}: ${messageText}</div>`,
                `<div class="chatmessage systemchatmessage7" data-ts="${timestamp}">Пожаловаться на модератора можно в дискорде, на этом канале: <a href="https://discord.gg/XeVKWWs" target="_blank">#report-a-moderator</a></div>`
            ];

            if (!suppressMessages) {
                if (action === 'Reset avatar') {
                    messages.splice(1, 1); // убрать сообщение о жалобе
                } else if (action === 'avatar') {
                    // оставить только сообщение "Reset avatar"
                } else if (action === 'Reset canvas') {
                    // Для "Reset canvas" не добавляем сообщение о выходе
                } else {
                    // сообщение о выходе
                    messages.push(
                        `<div class="chatmessage systemchatmessage" data-ts="${timestamp}">${nickname} - игрок вышел из комнаты</div>`
                    );
                }
            }

            messages.forEach(msg => chatBox.innerHTML += msg);
        }
    }

    function handleKick() {
        const nickname = prompt("Введите никнейм игрока для кика:");
        if (nickname) {
            addModeratorMessages(nickname, 'Kick');
            removePlayer(nickname);
            updatePlayerList();
            disableChatWithUser(nickname);
        }
    }

    function handleBan() {
        const nickname = prompt("Введите никнейм игрока для бана:");
        if (nickname) {
            bannedPlayers.push(nickname);
            addModeratorMessages(nickname, 'Ban');
            removePlayer(nickname);
            updatePlayerList();
            disableChatWithUser(nickname);
        }
    }

    function handleIpBan() {
        const nickname = prompt("Введите никнейм игрока для IP бана:");
        if (nickname) {
            bannedPlayers.push(nickname);
            addModeratorMessages(nickname, 'IP Ban', 'IxeVixe');
            removePlayer(nickname);
            updatePlayerList();
            disableChatWithUser(nickname);
        }
    }

    function handleResetName() {
        const nickname = prompt("Введите никнейм игрока для сброса имени:");
        if (nickname) {
            const playerList = document.getElementById('playerlist');
            if (playerList) {
                Array.from(playerList.querySelectorAll('.playerlist-row')).forEach(player => {
                    const nameElement = player.querySelector('.playerlist-name a');
                    if (nameElement && nameElement.textContent.trim() === nickname) {
                        nameElement.textContent = 'Renamed by moderator';
                    }
                });
            }
            addModeratorMessages(nickname, 'Reset player name', 'Moderator', true, '');
        }
    }

    function giveVip() {
        const nickname = prompt("Введите никнейм игрока для VIP:");
        if (nickname) {
            const avatars = document.querySelectorAll('img.playerlist-avatar');
            avatars.forEach(avatar => {
                const parentRow = avatar.closest('.playerlist-row');
                if (parentRow) {
                    const nameLink = parentRow.querySelector('.playerlist-name a');
                    if (nameLink && nameLink.textContent.trim() === nickname) {
                        const vipImg = document.createElement('img');
                        vipImg.src = '/img/marks/1.png';
                        vipImg.title = 'VIP (роль на нашем сервере Discord)';
                        vipImg.style.marginLeft = '5px';
                        avatar.insertAdjacentElement('afterend', vipImg);
                    }
                }
            });
        }
    }

    function resetAvatar() {
        const nickname = prompt("Введите никнейм игрока для сброса аватара:");
        if (nickname) {
            const avatars = document.querySelectorAll('img.playerlist-avatar');
            avatars.forEach(avatar => {
                const parentRow = avatar.closest('.playerlist-row');
                if (parentRow) {
                    const nameLink = parentRow.querySelector('.playerlist-name a');
                    if (nameLink && nameLink.textContent.trim() === nickname) {
                        avatar.remove();
                        const newAvatar = document.createElement('div');
                        newAvatar.style.width = '40px';
                        newAvatar.style.height = '40px';
                        newAvatar.style.backgroundColor = 'white';
                        newAvatar.className = 'playerlist-avatar';
                        parentRow.querySelector('.playerlist-name').insertAdjacentElement('afterbegin', newAvatar);
                        addModeratorMessages('avatar', 'Reset avatar', 'Moderator', false, '');
                    }
                }
            });
        }
    }

    function removePlayer(nickname) {
        const playerList = document.getElementById('playerlist');
        if (playerList) {
            Array.from(playerList.querySelectorAll('.playerlist-row')).forEach(player => {
                const nameElement = player.querySelector('.playerlist-name a');
                if (nameElement && nameElement.textContent.trim() === nickname) {
                    player.remove();
                }
            });
        }
    }

    function updatePlayerList() {
        const playerList = document.getElementById('playerlist');
        if (playerList) {
            Array.from(playerList.querySelectorAll('.playerlist-row')).forEach(player => {
                const nameElement = player.querySelector('.playerlist-name a');
                if (nameElement) {
                    const playerName = nameElement.textContent.trim();
                    if (bannedPlayers.includes(playerName)) {
                        player.remove();
                    }
                }
            });
        }
    }

    function disableChatWithUser(nickname) {
        const chatWithUser = document.querySelector(`.chat-with-${nickname}`);
        if (chatWithUser) {
            chatWithUser.style.display = 'none';
        }
    }

    // Создаем панель
    const panel = document.createElement('div');
    panel.style.position = 'fixed';
    panel.style.top = '10px';
    panel.style.right = '10px';
    panel.style.backgroundColor = 'black';
    panel.style.padding = '10px';
    panel.style.zIndex = '9999';
    panel.style.display = 'flex';
    panel.style.flexDirection = 'column';
    panel.style.gap = '5px';

    // Создаем кнопки
    const btnKick = document.createElement('button');
    btnKick.innerText = 'Kick';
    btnKick.style.backgroundColor = 'blue';
    btnKick.style.color = 'white';
    btnKick.style.border = 'none';
    btnKick.style.padding = '5px';
    btnKick.style.cursor = 'pointer';

    const btnBan = document.createElement('button');
    btnBan.innerText = 'Ban';
    btnBan.style.backgroundColor = 'blue';
    btnBan.style.color = 'white';
    btnBan.style.border = 'none';
    btnBan.style.padding = '5px';
    btnBan.style.cursor = 'pointer';

    const btnIpBan = document.createElement('button');
    btnIpBan.innerText = 'IP Ban';
    btnIpBan.style.backgroundColor = 'blue';
    btnIpBan.style.color = 'white';
    btnIpBan.style.border = 'none';
    btnIpBan.style.padding = '5px';
    btnIpBan.style.cursor = 'pointer';

    const btnResetName = document.createElement('button');
    btnResetName.innerText = 'Reset player name';
    btnResetName.style.backgroundColor = 'blue';
    btnResetName.style.color = 'white';
    btnResetName.style.border = 'none';
    btnResetName.style.padding = '5px';
    btnResetName.style.cursor = 'pointer';

    const btnVip = document.createElement('button');
    btnVip.innerText = 'Give a player VIP';
    btnVip.style.backgroundColor = 'blue';
    btnVip.style.color = 'white';
    btnVip.style.border = 'none';
    btnVip.style.padding = '5px';
    btnVip.style.cursor = 'pointer';

    // Новая кнопка "Reset canvas"
    const btnResetCanvas = document.createElement('button');
    btnResetCanvas.innerText = 'Reset canvas';
    btnResetCanvas.style.backgroundColor = 'blue';
    btnResetCanvas.style.color = 'white';
    btnResetCanvas.style.border = 'none';
    btnResetCanvas.style.padding = '5px';
    btnResetCanvas.style.cursor = 'pointer';

    // Обработчик для "Reset canvas"
    btnResetCanvas.addEventListener('click', () => {
        const canvas = document.querySelector('canvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        addModeratorMessages('canvas', 'Reset canvas', 'Moderator', false, 'canvas');
    });

    // Назначаем обработчики
    btnKick.addEventListener('click', handleKick);
    btnBan.addEventListener('click', handleBan);
    btnIpBan.addEventListener('click', handleIpBan);
    btnResetName.addEventListener('click', handleResetName);
    btnVip.addEventListener('click', giveVip);

    // Добавляем кнопки в панель
    panel.appendChild(btnKick);
    panel.appendChild(btnBan);
    panel.appendChild(btnIpBan);
    panel.appendChild(btnResetName);
    panel.appendChild(btnVip);
    panel.appendChild(btnResetCanvas);

    document.body.appendChild(panel);
})();