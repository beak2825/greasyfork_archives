// ==UserScript==
// @name         Uhmegle IP Logger
// @namespace    /
// @version      1.1
// @description  Show last detected IP of WebRTC peers on uhmegle.com with location info
// @author       Deff
// @match        https://uhmegle.com/*
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/548531/Uhmegle%20IP%20Logger.user.js
// @updateURL https://update.greasyfork.org/scripts/548531/Uhmegle%20IP%20Logger.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const ipContainer = document.createElement('div');
    ipContainer.id = 'ip-container';
    ipContainer.style.position = 'fixed';
    ipContainer.style.top = '10px';
    ipContainer.style.right = '10px';
    ipContainer.style.width = '350px';
    ipContainer.style.backgroundColor = '#1e1e1e';
    ipContainer.style.border = '1px solid #444';
    ipContainer.style.borderRadius = '12px';
    ipContainer.style.padding = '20px';
    ipContainer.style.zIndex = '10000';
    ipContainer.style.fontFamily = 'Arial, sans-serif';
    ipContainer.style.fontSize = '14px';
    ipContainer.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.6)';
    ipContainer.style.color = '#ffffff';
    ipContainer.innerHTML = `
        <div id="drag-handle" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; cursor: move;">
            <h3 style="margin: 0; color: #4da6ff;">Last Detected IP</h3>
            <button id="close-ip-container" style="padding: 6px 12px; border: none; background-color: #ff4d4d; color: white; border-radius: 8px; cursor: pointer;">X</button>
        </div>
        <div id="ip-addresses"></div>
    `;
    document.body.appendChild(ipContainer);

    document.getElementById('close-ip-container').addEventListener('click', () => {
        document.body.removeChild(ipContainer);
    });

    function makeDraggable(element, handle) {
        let posX = 0, posY = 0, mouseX = 0, mouseY = 0;
        handle.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e.preventDefault();
            mouseX = e.clientX;
            mouseY = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e.preventDefault();
            posX = mouseX - e.clientX;
            posY = mouseY - e.clientY;
            mouseX = e.clientX;
            mouseY = e.clientY;
            element.style.top = (element.offsetTop - posY) + "px";
            element.style.left = (element.offsetLeft - posX) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
    makeDraggable(ipContainer, document.getElementById('drag-handle'));

    window.oRTCPeerConnection = window.oRTCPeerConnection || window.RTCPeerConnection;

    window.RTCPeerConnection = function(...args) {
        const pc = new window.oRTCPeerConnection(...args);
        pc.oaddIceCandidate = pc.addIceCandidate;

        pc.addIceCandidate = function(iceCandidate, ...rest) {
            const fields = iceCandidate.candidate.split(' ');

            if (fields[7] === 'srflx') {
                const ipAddress = fields[4];
                const currentTime = new Date().toLocaleTimeString();

                fetch(`https://ipwho.is/${ipAddress}`)
                    .then(res => res.json())
                    .then(data => {
                        const ispInfo = data.org || 'Unknown ISP';
                        const cityInfo = data.city || 'Unknown City';
                        const countryInfo = data.country || 'Unknown Country';

                        const ipList = document.getElementById('ip-addresses');
                        ipList.innerHTML = `
                            <div style="background: #2c2c2c; border: 1px solid #555; padding: 12px; border-radius: 8px; color: #fff;">
                                <span><strong>Time:</strong> ${currentTime}</span><br>
                                <span><strong>IP Address:</strong> ${ipAddress}</span><br>
                                <span><strong>ISP:</strong> ${ispInfo}</span><br>
                                <span><strong>City:</strong> ${cityInfo}</span><br>
                                <span><strong>Country:</strong> ${countryInfo}</span><br>
                                <button id="copy-btn" style="margin-top: 10px; padding: 8px 12px; border: none; background-color: #4da6ff; color: white; border-radius: 8px; cursor: pointer;">Copy</button>
                            </div>
                        `;

                        const copyButton = document.getElementById('copy-btn');
                        copyButton.addEventListener('click', () => {
                            navigator.clipboard.writeText(ipAddress).then(() => {
                                copyButton.textContent = 'Copied!';
                                copyButton.style.backgroundColor = '#28a745';
                                setTimeout(() => {
                                    copyButton.textContent = 'Copy';
                                    copyButton.style.backgroundColor = '#4da6ff';
                                }, 2000);
                            });
                        });
                    })
                    .catch(err => console.error('Error fetching IP info:', err));
            }

            return pc.oaddIceCandidate(iceCandidate, ...rest);
        };

        return pc;
    };
})();
