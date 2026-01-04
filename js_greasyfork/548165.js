// ==UserScript==
// @name         Gartic AI BOT Pro
// @namespace    https://greasyfork.org/en/users/1353946-stragon-x
// @version      1.0
// @description  Gartic AI bot
// @author       STRAGON
// @match        https://Gartic.io/*
// @icon         https://pngimg.com/d/ai_PNG4.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/548165/Gartic%20AI%20BOT%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/548165/Gartic%20AI%20BOT%20Pro.meta.js
// ==/UserScript==

(function() {

    let originalSend = WebSocket.prototype.send, setTrue = false;
    window.wsObj = {};
    let firstValue = "";
    let firstValuex = "";
    let isSending = false;

    WebSocket.prototype.send = function(data) {
        console.log("Gönderilen Veri: " + data);
        originalSend.apply(this, arguments);
        if (Object.keys(window.wsObj).length == 0) {
            window.wsObj = this;
            window.eventAdd();
        }
    };

    window.eventAdd = () => {
        if (!setTrue) {
            setTrue = true;
            window.wsObj.addEventListener("message", async (msg) => {
                try {
                    if (msg.data.indexOf('42["5"') !== -1) {
                        let dataString = msg.data.slice(2);
                        let data = JSON.parse(dataString);
                        if (data.length > 1) {
                            firstValuex = data[2];
                        }
                    }

                    if (msg.data.indexOf('42["11"') !== -1) {
                        let dataString = msg.data.slice(2);
                        let data = JSON.parse(dataString);
                        if (data.length > 1) {
                            let extractedValue = data[1];
                            console.log(extractedValue);
                            let message = data[2];
                            let trimmedMessage = message.trim();
                                if (trimmedMessage.includes("chat bot") && isSending === false) {
                                isSending = true;

                                    let userQuestion = trimmedMessage.replace("chat bot", "").trim();

                                    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyC0QbSBoyMFsdbAF22OqGlybtVJGLLcctY", {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify({
                                            contents: [{
                                                parts: [{
                                                    text: userQuestion
                                                }]
                                            }]
                                        })
                                    });

                                    if (!response.ok) {
                                        const errorText = await response.text();
                                        throw new Error(`خطا در دریافت پاسخ: ${errorText}`);
                                    }

                                    const data = await response.json();
                                    console.log(data);

                                    if (data.candidates && data.candidates.length > 0 && data.candidates[0].content.parts.length > 0) {
                                        const answer = data.candidates[0].content.parts[0].text.trim().replace(/\n/g, '');

                                        const chunkSize = 100;
                                        const delay = 3000;


                                        if (answer.length > chunkSize) {
                                            for (let i = 0; i < answer.length; i += chunkSize) {
                                                const chunk = answer.slice(i, i + chunkSize);
                                                setTimeout(() => {
                                                    let messageToSend = `42[11,${firstValuex},"${chunk}"]`;
                                                    window.wsObj.send(messageToSend);
                                                }, (i / chunkSize) * delay);
                                            }
                                        } else {
                                            let messageToSend = `42[11,${firstValuex},"${answer}"]`;
                                            window.wsObj.send(messageToSend);
                                        }

                                        setTimeout(() => {
                                            isSending = false;
                                        }, Math.ceil(answer.length / chunkSize) * delay);
                                    } else {
                                        let errorMessage = "پاسخی از هوش مصنوعی دریافت نشد.";
                                        let messageToSend = `42[11,${window.wsObj.id},"${errorMessage}"]`;
                                        window.wsObj.send(messageToSend);
                                    }

                            }
                        }
                    }

                    if (msg.data.indexOf('42["16"') !== -1) {
                        let dataString = msg.data.slice(2);
                        let data = JSON.parse(dataString);
                        let formattedMessage = `42[34,${window.wsObj.id},${1}]`;
                        window.wsObj.send(formattedMessage);
                        let messages = [
                            '42[10,' + window.wsObj.id + ',[5,"xFF7829"]]',
                            '42[10,' + window.wsObj.id + ',[3,0,0,767,448]]',
                            '42[10,' + window.wsObj.id + ',[5,"x000000"]]',
                            '42[10,' + window.wsObj.id + ',[6,"31"]]',
                            '42[10,' + window.wsObj.id + ',[1,6,260,113,204,387]]',
                            '42[10,' + window.wsObj.id + ',[1,6,266,106,386,378]]',
                            '42[10,' + window.wsObj.id + ',[1,6,462,81,480,367]]',
                            '42[10,' + window.wsObj.id + ',[1,6,147,228,408,229]]',
                        ];
                        messages.forEach((message, index) => {
                            setTimeout(() => {
                                window.wsObj.send(message);
                            }, index * 100);
                        });

                        let messageToSend = `42[25,${window.wsObj.id}]`;
                        setTimeout(() => {
                            window.wsObj.send(messageToSend);
                        }, 5000);

                        if (data[0] == 5) {
                            window.wsObj.lengthID = data[1];
                            window.wsObj.id = data[2];
                            window.wsObj.roomCode = data[3];
                            window.wsObj.uders = data[5];
                        }
                    }
                } catch (err) {
                    console.error("Error parsing message data:", err);
                }
            });
        }
    };


})();