// ==UserScript==
// @name         Line Spamer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Different spamer
// @author       STRAGON
// @license        N/A
// @match        https://gartic.io/*
// @grant        none
// @icon         https://cdn.imgurl.ir/uploads/c98990_bullet-in-motion-with-flames-trailing-behind-png.png
// @downloadURL https://update.greasyfork.org/scripts/555317/Line%20Spamer.user.js
// @updateURL https://update.greasyfork.org/scripts/555317/Line%20Spamer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const reopenButton = document.createElement('button');
    reopenButton.innerText = '🎱';
    reopenButton.style.position = 'fixed';
    reopenButton.style.bottom = '20px';
    reopenButton.style.right = '20px';
    reopenButton.style.width = '45px';
    reopenButton.style.height = '45px';
    reopenButton.style.borderRadius = '50%';
    reopenButton.style.background = 'linear-gradient(90deg, #ff0000, #ff6a00)';
    reopenButton.style.color = 'white';
    reopenButton.style.border = 'none';
    reopenButton.style.cursor = 'pointer';
    reopenButton.style.boxShadow = '0 0 20px rgba(255,0,0,0.6)';
    reopenButton.style.fontSize = '20px';
    reopenButton.style.transition = 'all 0.3s ease';
    reopenButton.style.zIndex = '99999';
    reopenButton.style.display = 'none';
    document.body.appendChild(reopenButton);

    reopenButton.addEventListener('mouseover', () => {
        reopenButton.style.transform = 'scale(1.2)';
        reopenButton.style.boxShadow = '0 0 25px rgba(255,0,0,1)';
    });
    reopenButton.addEventListener('mouseout', () => {
        reopenButton.style.transform = 'scale(1)';
        reopenButton.style.boxShadow = '0 0 20px rgba(255,0,0,0.6)';
    });

    function createPanel() {
        const panel = document.createElement('div');
        panel.style.position = 'fixed';
        panel.style.top = '10px';
        panel.style.right = '10px';
        panel.style.background = 'rgba(0, 0, 0, 0.5)';
        panel.style.backdropFilter = 'blur(10px)';
        panel.style.border = '1px solid rgba(255, 255, 255, 0.2)';
        panel.style.padding = '10px';
        panel.style.zIndex = '10000';
        panel.style.width = '220px';
        panel.style.height = '270px';
        panel.style.borderRadius = '15px';
        panel.style.display = 'flex';
        panel.style.flexDirection = 'column';
        panel.style.alignItems = 'center';
        panel.style.boxShadow = '0 0 15px rgba(255,255,255,0.2)';
        panel.style.transition = 'all 0.3s ease';
        document.body.appendChild(panel);

        const topHandle = document.createElement('div');
        topHandle.style.width = '100%';
        topHandle.style.height = '25px';
        topHandle.style.background = 'rgba(255, 255, 255, 0.1)';
        topHandle.style.borderRadius = '10px 10px 0 0';
        topHandle.style.cursor = 'grab';
        topHandle.style.display = 'flex';
        topHandle.style.alignItems = 'center';
        topHandle.style.justifyContent = 'center';
        topHandle.style.color = 'white';
        topHandle.style.fontSize = '13px';
        topHandle.style.userSelect = 'none';
        topHandle.innerText = '⠿  Drag to move';
        panel.appendChild(topHandle);

        const textarea = document.createElement('textarea');
        textarea.rows = 5;
        textarea.cols = 20;
        textarea.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
        textarea.style.color = 'white';
        textarea.style.width = '89%';
        textarea.style.borderRadius = '5px';
        textarea.style.border = '1px solid rgba(255,255,255,0.3)';
        textarea.style.padding = '5px';
        textarea.style.marginTop = '10px';
        textarea.style.resize = 'none';
        panel.appendChild(textarea);

        const speedLabel = document.createElement('label');
        speedLabel.innerText = 'Speed:';
        speedLabel.style.color = 'white';
        speedLabel.style.marginTop = '10px';
        panel.appendChild(speedLabel);

        const speedInput = document.createElement('input');
        speedInput.type = 'range';
        speedInput.min = '0.9';
        speedInput.max = '5';
        speedInput.step = '0.1';
        speedInput.value = '1';
        speedInput.style.width = '100%';
        panel.appendChild(speedInput);

        const speedValue = document.createElement('span');
        speedValue.innerText = speedInput.value;
        speedValue.style.color = 'white';
        speedValue.style.marginTop = '5px';
        panel.appendChild(speedValue);

        speedInput.addEventListener('input', () => {
            speedValue.innerText = speedInput.value;
        });

        const sendButton = document.createElement('button');
        sendButton.innerText = 'Send Messages';
        sendButton.style.background = 'linear-gradient(90deg, #ff0000, #ff6a00)';
        sendButton.style.color = 'white';
        sendButton.style.width = '100%';
        sendButton.style.height = '30px';
        sendButton.style.border = 'none';
        sendButton.style.borderRadius = '5px';
        sendButton.style.marginTop = '10px';
        sendButton.style.cursor = 'pointer';
        sendButton.style.fontWeight = 'bold';
        sendButton.style.letterSpacing = '1px';
        sendButton.style.transition = 'all 0.3s ease';
        sendButton.style.boxShadow = '0 0 10px rgba(255, 0, 0, 0.6)';
        panel.appendChild(sendButton);

        sendButton.addEventListener('mouseover', () => {
            sendButton.style.transform = 'scale(1.05)';
            sendButton.style.boxShadow = '0 0 25px rgba(255, 0, 0, 1)';
            sendButton.style.background = 'linear-gradient(90deg, #ff6a00, #ff0000)';
        });
        sendButton.addEventListener('mouseout', () => {
            sendButton.style.transform = 'scale(1)';
            sendButton.style.boxShadow = '0 0 10px rgba(255, 0, 0, 0.6)';
            sendButton.style.background = 'linear-gradient(90deg, #ff0000, #ff6a00)';
        });

        const closeButton = document.createElement('button');
        closeButton.innerText = '✖ Close Panel';
        closeButton.style.background = 'linear-gradient(90deg, #ff0000, #ff6a00)';
        closeButton.style.color = 'white';
        closeButton.style.width = '100%';
        closeButton.style.height = '35px';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '8px';
        closeButton.style.marginTop = '20px'; 
        closeButton.style.cursor = 'pointer';
        closeButton.style.fontWeight = 'bold';
        closeButton.style.transition = 'all 0.3s ease';
        closeButton.style.boxShadow = '0 0 15px rgba(255, 0, 0, 0.7)';
        closeButton.style.letterSpacing = '0.5px';
        panel.appendChild(closeButton);

        closeButton.addEventListener('mouseover', () => {
            closeButton.style.transform = 'scale(1.07)';
            closeButton.style.boxShadow = '0 0 30px rgba(255, 80, 0, 1)';
            closeButton.style.background = 'linear-gradient(90deg, #ff6a00, #ff0000)';
        });
        closeButton.addEventListener('mouseout', () => {
            closeButton.style.transform = 'scale(1)';
            closeButton.style.boxShadow = '0 0 15px rgba(255, 0, 0, 0.7)';
            closeButton.style.background = 'linear-gradient(90deg, #ff0000, #ff6a00)';
        });

        closeButton.addEventListener('click', () => {
            panel.style.transition = 'all 0.4s ease';
            panel.style.opacity = '0';
            panel.style.transform = 'scale(0.9)';
            setTimeout(() => {
                panel.remove();
                reopenButton.style.display = 'block';
            }, 400);
        });

        let isDragging = false;
        let offsetX, offsetY;
        topHandle.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - panel.getBoundingClientRect().left;
            offsetY = e.clientY - panel.getBoundingClientRect().top;
            topHandle.style.cursor = 'grabbing';
        });
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                panel.style.left = `${e.clientX - offsetX}px`;
                panel.style.top = `${e.clientY - offsetY}px`;
            }
        });
        document.addEventListener('mouseup', () => {
            isDragging = false;
            topHandle.style.cursor = 'grab';
        });

        sendButton.addEventListener('click', () => {
            const lines = textarea.value.split('\n');
            let index = 0;
            const speed = parseFloat(speedInput.value);

            const sendNextLine = () => {
                if (index < lines.length) {
                    const message = `42[11,${window.wsObj.id},"${lines[index]}"]`;
                    window.wsObj.send(message);
                    index++;
                    setTimeout(sendNextLine, speed * 1000);
                }
            };
            sendNextLine();
        });
    }

    reopenButton.addEventListener('click', () => {
        createPanel();
        reopenButton.style.display = 'none';
    });

    let originalSend = WebSocket.prototype.send;
    let setTrue = false;
    window.wsObj = {};

    WebSocket.prototype.send = function (data) {
        originalSend.apply(this, arguments);
        if (Object.keys(window.wsObj).length === 0) {
            window.wsObj = this;
            window.eventAdd();
        }
    };

    window.eventAdd = () => {
        if (!setTrue) {
            setTrue = true;
            window.wsObj.addEventListener('message', (msg) => {
                try {
                    let data = JSON.parse(msg.data.slice(2));
                    if (data[0] == 5) {
                        window.wsObj.id = data[2];
                    }
                } catch {}
            });
        }
    };

    createPanel();
})();
