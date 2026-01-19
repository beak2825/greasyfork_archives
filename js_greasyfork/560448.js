// ==UserScript==
// @name         Azar IP Scanner
// @namespace    https://github.com/VeltrixJS/azar-ip-sniffer
// @version      2.8
// @description  IP Tracker for Azar with geolocation (Unlimited API)
// @author       VeltrixJS
// @match        https://azarlive.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=azarlive.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560448/Azar%20IP%20Scanner.user.js
// @updateURL https://update.greasyfork.org/scripts/560448/Azar%20IP%20Scanner.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const AZAR_GREEN = '#51f59b';
    const AZAR_DARK = '#121212';
    const AZAR_WHITE = '#ffffff';

    const createElement = (tag, options = {}, children = []) => {
        const el = document.createElement(tag);
        Object.assign(el, options);
        Object.entries(options.style || {}).forEach(([key, val]) => el.style[key] = val);
        children.forEach(child => el.appendChild(child));
        return el;
    };

    const ipContainer = createElement('div', {
        id: 'ip-container',
        style: {
            position: 'fixed',
            top: '10px',
            right: '10px',
            width: '400px',
            maxHeight: '500px',
            backgroundColor: AZAR_DARK,
            border: `1px solid ${AZAR_GREEN}`,
            borderRadius: '16px',
            padding: '20px',
            zIndex: '10000',
            fontFamily: 'Inter, Arial, sans-serif',
            fontSize: '14px',
            boxShadow: `0 8px 32px rgba(81, 245, 155, 0.2)`,
            color: AZAR_WHITE,
            resize: 'both',
            overflow: 'auto',
        }
    });

    ipContainer.innerHTML = `
        <div id="drag-handle" style="cursor:move;margin-bottom:20px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                <h3 style="margin:0;color:${AZAR_GREEN};font-weight:800;text-transform:uppercase;letter-spacing:1px;">Detected IP</h3>
                <div style="display:flex;gap:8px;">
                    <button id="open-popup" style="padding:8px 12px;border:1px solid ${AZAR_GREEN};background-color:transparent;color:${AZAR_GREEN};border-radius:8px;cursor:pointer;font-weight:600;font-size:12px;">📺 POPUP</button>
                    <button id="close-ip-container" style="padding:8px 12px;border:none;background-color:${AZAR_GREEN};color:${AZAR_DARK};border-radius:8px;cursor:pointer;font-weight:bold;">X</button>
                </div>
            </div>
        </div>
        <div id="ip-addresses"></div>
        <div style="margin-top:15px;text-align:center;">
            <a href="https://github.com/VeltrixJS" target="_blank" style=" display:inline-flex; align-items:center; justify-content:center; gap:8px; background-color:#222; color:${AZAR_GREEN}; border:1px solid ${AZAR_GREEN}; padding:8px 16px; text-decoration:none; font-weight:600; border-radius:8px; font-size:12px; transition: all 0.2s;" onmouseover="this.style.backgroundColor='${AZAR_GREEN}'; this.style.color='${AZAR_DARK}';" onmouseout="this.style.backgroundColor='#222'; this.style.color='${AZAR_GREEN}';">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24"> <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.089-.744.084-.729.084-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.835 2.809 1.304 3.495.997.108-.775.418-1.305.762-1.605-2.665-.305-5.466-1.332-5.466-5.93 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23a11.5 11.5 0 013.003-.404c1.018.005 2.045.138 3.003.404 2.292-1.552 3.298-1.23 3.298-1.23.653 1.653.242 2.873.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.61-2.803 5.624-5.475 5.921.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .319.218.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/> </svg> GitHub
            </a>
        </div>
    `;
    document.body.appendChild(ipContainer);

    const miniContainer = createElement('div', {
        id: 'mini-ip-container',
        style: {
            position: 'fixed',
            top: '10px',
            right: '10px',
            width: '50px',
            height: '50px',
            backgroundColor: AZAR_DARK,
            border: `2px solid ${AZAR_GREEN}`,
            borderRadius: '50%',
            zIndex: '10000',
            cursor: 'pointer',
            display: 'none',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: `0 0 15px ${AZAR_GREEN}66`,
        }
    });
    miniContainer.innerHTML = `<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="${AZAR_GREEN}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`;
    document.body.appendChild(miniContainer);

    let popupWindow = null;

    function setupEventListeners() {
        document.getElementById('open-popup').onclick = () => {
            if (popupWindow && !popupWindow.closed) {
                popupWindow.focus();
                return;
            }

            popupWindow = window.open('', 'IPTracker', 'width=420,height=380,left=100,top=100');

            popupWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Azar IP Tracker</title>
                    <style>
                        body {
                            margin: 0;
                            padding: 20px;
                            background-color: ${AZAR_DARK};
                            font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
                            color: ${AZAR_WHITE};
                        }
                        #ip-container {
                            background-color: ${AZAR_DARK};
                        }
                        h3 {
                            margin: 0 0 20px 0;
                            color: ${AZAR_GREEN};
                            text-transform: uppercase;
                            font-size: 18px;
                            font-weight: 800;
                            letter-spacing: 1px;
                        }
                        .ip-item {
                            display: flex;
                            flex-direction: column;
                            background-color: #1c1c1c;
                            border-left: 4px solid ${AZAR_GREEN};
                            padding: 15px;
                            margin-bottom: 15px;
                            border-radius: 8px;
                            color: ${AZAR_WHITE};
                        }
                        .ip-item strong {
                            color: ${AZAR_GREEN};
                            margin-right: 5px;
                        }
                        .time-label {
                            margin-bottom: 8px;
                            font-size: 12px;
                            opacity: 0.6;
                        }
                        .info-line {
                            margin-bottom: 4px;
                        }
                        .ip-buttons {
                            display: flex;
                            gap: 8px;
                            margin-top: 12px;
                        }
                        button {
                            flex: 1;
                            padding: 8px;
                            border: none;
                            background-color: ${AZAR_GREEN};
                            color: ${AZAR_DARK};
                            border-radius: 6px;
                            cursor: pointer;
                            font-weight: 600;
                            transition: all 0.2s;
                        }
                        button:hover {
                            opacity: 0.8;
                            transform: translateY(-1px);
                        }
                        .maps-btn {
                            background: ${AZAR_WHITE} !important;
                            color: ${AZAR_DARK} !important;
                        }
                        .github-link {
                            display: inline-flex;
                            align-items: center;
                            justify-content: center;
                            gap: 8px;
                            background-color: #222;
                            color: ${AZAR_GREEN};
                            border: 1px solid ${AZAR_GREEN};
                            padding: 8px 16px;
                            text-decoration: none;
                            font-weight: 600;
                            border-radius: 8px;
                            font-size: 12px;
                            transition: all 0.2s;
                            margin-top: 15px;
                        }
                        .github-link:hover {
                            background-color: ${AZAR_GREEN};
                            color: ${AZAR_DARK};
                        }
                    </style>
                </head>
                <body>
                    <div id="ip-container">
                        <h3>Live IP Tracker</h3>
                        <div id="ip-addresses"></div>
                        <div style="text-align:center;">
                            <a href="https://github.com/VeltrixJS" target="_blank" class="github-link">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.089-.744.084-.729.084-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.835 2.809 1.304 3.495.997.108-.775.418-1.305.762-1.605-2.665-.305-5.466-1.332-5.466-5.93 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23a11.5 11.5 0 013.003-.404c1.018.005 2.045.138 3.003.404 2.292-1.552 3.298-1.23 3.298-1.23.653 1.653.242 2.873.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.61-2.803 5.624-5.475 5.921.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .319.218.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                                </svg>
                                GitHub
                            </a>
                        </div>
                    </div>
                </body>
                </html>
            `);
            popupWindow.document.close();
        };

        document.getElementById('close-ip-container').onclick = () => {
            miniContainer.style.top = ipContainer.offsetTop + 'px';
            miniContainer.style.left = ipContainer.offsetLeft + 'px';
            ipContainer.style.display = 'none';
            miniContainer.style.display = 'flex';
        };
    }

    setupEventListeners();

    function makeDraggable(el, handle) {
        let posX = 0, posY = 0, mouseX = 0, mouseY = 0;
        let isDragging = false;
        let startX = 0, startY = 0;

        handle.onmousedown = (e) => {
            e.preventDefault();
            isDragging = false;
            startX = e.clientX;
            startY = e.clientY;
            mouseX = e.clientX;
            mouseY = e.clientY;
            document.onmouseup = () => {
                document.onmousemove = null;
                if (!isDragging && el.id === 'mini-ip-container') {
                    ipContainer.style.top = miniContainer.offsetTop + 'px';
                    ipContainer.style.left = miniContainer.offsetLeft + 'px';
                    ipContainer.style.display = 'block';
                    miniContainer.style.display = 'none';
                    setupEventListeners();
                }
            };
            document.onmousemove = (e) => {
                if (Math.abs(e.clientX - startX) > 5 || Math.abs(e.clientY - startY) > 5) {
                    isDragging = true;
                }
                posX = mouseX - e.clientX;
                posY = mouseY - e.clientY;
                mouseX = e.clientX;
                mouseY = e.clientY;
                el.style.top = (el.offsetTop - posY) + "px";
                el.style.left = (el.offsetLeft - posX) + "px";
            };
        };
    }
    makeDraggable(ipContainer, document.getElementById('drag-handle'));
    makeDraggable(miniContainer, miniContainer);

    let currentIP = null;
    window.oRTCPeerConnection = window.oRTCPeerConnection || window.RTCPeerConnection;

    window.RTCPeerConnection = function (...args) {
        const pc = new window.oRTCPeerConnection(...args);
        pc.oaddIceCandidate = pc.addIceCandidate;

        pc.addIceCandidate = async function (iceCandidate, ...rest) {
            try {
                console.log('[Azar Sniffer] ICE Candidate:', iceCandidate);

                if (iceCandidate && iceCandidate.candidate) {
                    const fields = iceCandidate.candidate.split(' ');
                    console.log('[Azar Sniffer] Candidate fields:', fields);

                    if (fields[7] === 'srflx') {
                        const ip = fields[4];
                        console.log('[Azar Sniffer] Found IP:', ip);

                        if (currentIP === ip) {
                            console.log('[Azar Sniffer] IP already detected, skipping');
                            return pc.oaddIceCandidate(iceCandidate, ...rest);
                        }
                        currentIP = ip;

                        document.getElementById('ip-addresses').innerHTML = '';
                        if (popupWindow && !popupWindow.closed) {
                            popupWindow.document.getElementById('ip-addresses').innerHTML = '';
                        }

                        console.log('[Azar Sniffer] Fetching data for IP:', ip);

                        let data = null;
                        let isp = 'N/A';

                        try {
                            const res1 = await fetch(`http://ip-api.com/json/${ip}`);
                            const data1 = await res1.json();
                            if (data1.status !== 'fail') {
                                data = {
                                    city: data1.city,
                                    region: data1.regionName,
                                    postal: data1.zip,
                                    country: data1.country
                                };
                                isp = data1.isp || 'N/A';
                                console.log('[Azar Sniffer] ip-api.com OK:', data1);
                            } else {
                                throw new Error('ip-api.com failed');
                            }
                        } catch (error) {
                            console.log('[Azar Sniffer] ip-api.com failed, trying ipapi.co...');

                            try {
                                const res2 = await fetch(`https://ipapi.co/${ip}/json/`);
                                const data2 = await res2.json();
                                if (!data2.error) {
                                    data = {
                                        city: data2.city,
                                        region: data2.region,
                                        postal: data2.postal,
                                        country: data2.country_name
                                    };
                                    isp = data2.org || 'N/A';
                                    console.log('[Azar Sniffer] ipapi.co OK:', data2);
                                } else {
                                    throw new Error('ipapi.co failed');
                                }
                            } catch (error2) {
                                console.log('[Azar Sniffer] ipapi.co failed, trying ipwho.is...');

                                try {
                                    const res3 = await fetch(`https://ipwho.is/${ip}`);
                                    const data3 = await res3.json();
                                    if (data3.success !== false) {
                                        data = {
                                            city: data3.city,
                                            region: data3.region,
                                            postal: data3.postal,
                                            country: data3.country
                                        };
                                        isp = data3?.connection?.isp || 'N/A';
                                        console.log('[Azar Sniffer] ipwho.is OK:', data3);
                                    } else {
                                        throw new Error('ipwho.is failed');
                                    }
                                } catch (error3) {
                                    console.error('[Azar Sniffer] All APIs failed!');
                                }
                            }
                        }

                        const city = data?.city || 'Unknown';
                        const region = data?.region || 'Unknown';
                        const postal = data?.postal || '';
                        const departmentNumber = postal ? postal.substring(0, 2) : '??';
                        const country = data?.country || 'Unknown';

                        const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(city + ' ' + country)}`;
                        const time = new Date().toLocaleTimeString();

                        // Interface principale
                        const ipItem = document.createElement('div');
                        ipItem.style.cssText = `
                            display: flex;
                            flex-direction: column;
                            background-color: #1c1c1c;
                            border-left: 4px solid ${AZAR_GREEN};
                            padding: 15px;
                            margin-bottom: 12px;
                            border-radius: 8px;
                            color: ${AZAR_WHITE};
                        `;

                        ipItem.innerHTML = `
                            <div style="margin-bottom:8px; font-size:12px; opacity:0.6;">Detected at: ${time}</div>
                            <div style="margin-bottom:4px;"><strong style="color:${AZAR_GREEN}">IP:</strong> ${ip}</div>
                            <div style="margin-bottom:4px;"><strong style="color:${AZAR_GREEN}">ISP:</strong> ${isp}</div>
                            <div style="margin-bottom:12px;"><strong style="color:${AZAR_GREEN}">LOC:</strong> ${city}, ${region} (${departmentNumber}) - ${country}</div>

                            <div style="display:flex;gap:8px;">
                                <button class="copy-btn" style="flex:1;padding:8px;border:none;background:${AZAR_GREEN};color:${AZAR_DARK};border-radius:6px;cursor:pointer;font-weight:600;">Copy</button>
                                <button class="maps-btn" style="flex:1;padding:8px;border:none;background:${AZAR_WHITE};color:${AZAR_DARK};border-radius:6px;cursor:pointer;font-weight:600;">Maps</button>
                            </div>
                        `;

                        ipItem.querySelector('.copy-btn').onclick = () => navigator.clipboard.writeText(ip);
                        ipItem.querySelector('.maps-btn').onclick = () => window.open(mapsUrl, '_blank');

                        document.getElementById('ip-addresses').appendChild(ipItem);

                        // Fenêtre popup avec les mêmes fonctionnalités
                        if (popupWindow && !popupWindow.closed) {
                            const popupHTML = `
                                <div class="ip-item">
                                    <div class="time-label">Detected at: ${time}</div>
                                    <div class="info-line"><strong>IP:</strong> ${ip}</div>
                                    <div class="info-line"><strong>ISP:</strong> ${isp}</div>
                                    <div class="info-line" style="margin-bottom:12px;"><strong>LOC:</strong> ${city}, ${region} (${departmentNumber}) - ${country}</div>
                                    <div class="ip-buttons">
                                        <button onclick="navigator.clipboard.writeText('${ip}')">Copy</button>
                                        <button class="maps-btn" onclick="window.open('${mapsUrl}', '_blank')">Maps</button>
                                    </div>
                                </div>
                            `;
                            popupWindow.document.getElementById('ip-addresses').innerHTML += popupHTML;
                        }
                    }
                }
            } catch (err) {
                console.error('[Azar Sniffer] Error:', err);
            }
            return pc.oaddIceCandidate(iceCandidate, ...rest);
        };
        return pc;
    };
})();