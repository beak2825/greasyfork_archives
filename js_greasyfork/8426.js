// ==UserScript==
// @name      Download Youtube videos and subtitles
// @namespace  https://www.findhao.net
// @version    0.6.1
// @description  获取youtube视频和字幕的下载链接
// @match           https://www.youtube.com/watch
// @match           https://*.youtube.com/*
// @grant           GM_addStyle
// @run-at          document-idle
// @copyright  2023+, Find
// @author FindHao
// @downloadURL https://update.greasyfork.org/scripts/8426/Download%20Youtube%20videos%20and%20subtitles.user.js
// @updateURL https://update.greasyfork.org/scripts/8426/Download%20Youtube%20videos%20and%20subtitles.meta.js
// ==/UserScript==

(function() {
    const BASE_URL = "https://addyoutube.com";
    const BUTTON_ID = "dwnldBtn";
    const TARGET_BUTTON = "#owner"; // Updated target element selector

    const buttonStyle = `
        #${BUTTON_ID} {
            background-color: #28a745;
            color: #FFFFFF;
            border: 1px solid #3F3F3F;
            border-color: rgba(255,255,255,0.2);
            margin-left: 8px; /* Decreased margin-left to 8px for smaller gap */
            padding: 0 16px;
            border-radius: 18px; /* Updated border radius */
            font-size: 14px;
            font-family: Roboto, Noto, sans-serif;
            font-weight: 500;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            height: 36px;
            line-height: normal;
        }
        #${BUTTON_ID}:hover {
            background-color: #3F3F3F;
            color: #ffffff;
            border-color: #3F3F3F;
        }
    `;

    GM_addStyle(buttonStyle);

    function transformUrl(originalUrl) {
        return originalUrl.replace("youtube.com", "addyoutube.com");
    }

    function waitForElement(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                console.log(`[Youtube Download Button]: Video Found, checking if button exists...`);
                return resolve(document.querySelector(selector));
            }
            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    console.log(`[Youtube Download Button]: Video Found by observer, checking if button exists...`);
                    resolve(document.querySelector(selector));
                    observer.disconnect();
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        });
    }

    function addButton() {
        waitForElement(TARGET_BUTTON).then((btnContainer) => {
            if (!btnContainer) {
                return;
            }

            if (document.querySelector(`#${BUTTON_ID}`)) { // Check if the button already exists
                console.log(`[Youtube Download Button]: Download button exists`);
            } else {
                const downloadButton = document.createElement('a');
                downloadButton.href = transformUrl(window.location.href);
                downloadButton.target = '_blank';
                downloadButton.id = BUTTON_ID;
                downloadButton.innerText = 'Download';
                btnContainer.appendChild(downloadButton);
                console.log(`[Youtube Download Button]: Button added successfully`);
            }
        }).catch(error => {
            console.error(`[Youtube Download Button]: Error adding button: ${error}`);
        });
    }

    function updateButton() {
        waitForElement(`#${BUTTON_ID}`).then((btn) => {
            if (!btn) {
                return;
            }
            btn.href = transformUrl(window.location.href);
        }).catch(error => {
            console.error(`[Youtube Download Button]: Error updating button: ${error}`);
        });
    }

    let buttonAdded = false;

    function checkAndAddButton() {
        if (window.location.pathname === '/watch' && !buttonAdded) {
            addButton();
            buttonAdded = true;
            setTimeout(updateButton, 2000); // Delay of 2 seconds for update
        }
    }

    window.addEventListener("yt-navigate-finish", () => {
        buttonAdded = false; // Reset flag when navigation happens
        checkAndAddButton();
    });

    checkAndAddButton(); // Initial check when script runs
})();

