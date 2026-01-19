// ==UserScript==
// @name         SKLauncher Bypass
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Bypasses the requirement to view ads to download and reveals the actual files dynamically per update.
// @author       InternetNinjo
// @match        https://skmedix.pl/*
// @grant        GM_xmlhttpRequest
// @connect      skmedix.pl
// @connect      api.quotable.io
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563188/SKLauncher%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/563188/SKLauncher%20Bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. Fetch a random quote from the Web
    const fetchWebQuote = () => {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://api.quotable.io/random?maxLength=85",
                onload: (res) => {
                    try {
                        const data = JSON.parse(res.responseText);
                        resolve(`${data.content} — ${data.author}`);
                    } catch(e) {
                        resolve("Don't dig straight down!");
                    }
                },
                onerror: () => resolve("Minecraft is better with friends.")
            });
        });
    };

    const getPageVersion = () => {
        const paragraphs = document.querySelectorAll('p.fw-light');
        for (let p of paragraphs) {
            if (p.textContent.includes('Version')) {
                const match = p.textContent.match(/\d+\.\d+\.\d+/);
                return match ? match[0] : null;
            }
        }
        return "3.2.18";
    };

    const checkUrl = (url) => {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({ method: "HEAD", url: url, onload: (res) => resolve(res.status === 200), onerror: () => resolve(false) });
        });
    };

    const init = async () => {
        const version = getPageVersion();
        const quote = await fetchWebQuote();

        const box = document.createElement('div');
        box.style = `
            position: fixed; bottom: 30px; right: 30px; z-index: 10000;
            background: rgba(24, 24, 27, 0.98); backdrop-filter: blur(12px);
            border: 1px solid #845ec2; border-radius: 16px; padding: 24px;
            color: #efe9f3; font-family: 'Inter', sans-serif;
            box-shadow: 0 20px 40px rgba(0,0,0,0.8); min-width: 320px;
        `;
        box.innerHTML = `<div style="font-size: 14px; color: #ababad;">📡 Verifying links...</div>`;
        document.body.appendChild(box);

        const jarUrl = `https://skmedix.pl/binaries/skl/${version}/SKlauncher-${version}.jar`;
        const exeUrl = `https://skmedix.pl/binaries/skl/${version}/win-x64/SKlauncher-${version}_Setup.exe`;
        const jarExists = await checkUrl(jarUrl);
        const exeExists = await checkUrl(exeUrl);

        box.innerHTML = `
            <div style="margin-bottom: 22px; text-align: center; font-style: italic; color: #ffeb3b; font-size: 12px; line-height: 1.5; text-shadow: 1px 1px 2px #000; padding: 0 5px;">
                "${quote}"
            </div>

            <div style="display: flex; align-items: center; margin-bottom: 20px;">
                <div style="background: #845ec2; width: 8px; height: 8px; border-radius: 50%; margin-right: 10px; box-shadow: 0 0 10px #845ec2;"></div>
                <span style="font-weight: 800; font-size: 18px; letter-spacing: -0.5px;">SKlauncher Toolbox</span>
            </div>

            <div style="display: grid; gap: 10px;">
                <div style="font-size: 11px; color: #845ec2; font-weight: bold; text-transform: uppercase; margin-bottom: 4px; letter-spacing: 0.5px;">Verified Downloads (v${version})</div>
                ${exeExists ? `
                    <a href="${exeUrl}" style="background: linear-gradient(135deg, #1a75ff, #845ec2); color: white; text-align: center; padding: 12px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 14px; transition: transform 0.1s ease;">
                        Download Installer (.exe)
                    </a>` : ''}
                ${jarExists ? `
                    <a href="${jarUrl}" style="background: rgba(132, 94, 194, 0.15); border: 1px solid #845ec2; color: #efe9f3; text-align: center; padding: 12px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 14px;">
                        Download Universal (.jar)
                    </a>` : ''}
            </div>

            ${(!jarExists && !exeExists) ? `<div style="color: #be3a51; font-size: 13px; margin-top: 10px;">Files not found on binary server.</div>` : ''}
        `;
    };

    init();
})();