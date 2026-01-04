// ==UserScript==
// @name         EzConv.com Youtube to MP3 Link Injector and Downloader
// @namespace    https://violentmonkey.github.io/
// @version      1.0
// @description  Get the video link from q parameter in the URL and automatically pastes it into ezconv.com input field, clicks Convert, and then Download MP3
// @author       Streampunk
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAANlBMVEVHcEzTCgrPCAjOCAjdDQ3JBgbVCgq4AADdDQ3MBwfdDQ3IBga4AADJBga4AAC4AADdDQ3dDQ0KQmz1AAAAEXRSTlMAZjR0zRCN/q4i5VGkQsTfwqhfr2oAAAP7SURBVHic7ZrRkqQgDEUFBEREmv//2bUksRdEhW5Htna4L05PKRxDAiHYdU1NTU1NTU1NTU1NTf+RzMTrAkjJ6gIwq+oCVJdhlXyA+KFXUs5V+udS0qoA3Wz9VdcOw2oy2l/ZUCcMNUxAxrnx0Y75PK1XIqVYr8659R/G6kcAljf3fwgAQYDpnmjg2P6hRPiiG4CabvGFJawzo4qJEOAu0Yv34JPvWDg3BABmjnwAbrxNYJhJyrWjwbk+AJDR4FEpPxkTZW16CIj0TidgCt4BWGnDJwotoBW2n36OoZMbf+MOoNNfTckYXceGo+HPPcAOuShTorlRbMaeJwGEC03HpCQlBCgOhpwjSzDwgdH5jmIAtVxXI1G4sRRA+Y6X9sz6Bzj7JgljcwlAMBpYUf8CJqAewruj8LiC5V7AGF0CdCRyIp0VDbOUJgBAWbAo6hoAxIfBo8e2TIta388GMFnfHPNgWxRcAhhoaYAbl5bO4lPNYXghgI5TvZdzPAvAwky1s6WZUwGOiyhnJgDguOFRZO2XL+3rLIBDb4oH04vOW8chNwdc6WfYfACMJ2yJ4tyqkxZALY+zAADEYY0pAABhS0Ym3xylBE0CqNF5y+mJlgEwN4ZDwCCQqUhZwMK0EQOIKNfMBzixZbRcrpJXAGYotMAOgAl+AqDALkcACtr/HIDAjcsQnM0HRwBL2u/UVwDxYEYiPXkKgPVm3z+H9h8AoMnMhV49dh8AtlQVYO+F2dw/BVB9CNSzTpiYCDCXfSAMB3eWm1WbiDjsZ64M9zkAQwCeTA0vV0MxrlPlF4vR0PsVP13Pk5BAPbIcp2ofuKuPH6OY0ypWmBMOEFcbgIY9IpkTa8GmHbeiaKLSnJDucsKzlIxDZWeE9n8wJ1TJkiqm5WpgwWPcwn7GeMJ8AAKJz/YqBMI/nZbH1b2/uEOfHQs2JulNHrFRiSGQmkILLJtF7zIUs3myjdU5gAby1zsrPul303y0ofp4c0rH0SPnbU4n2P6/d0bQGu7oSG6BojORr+VZAItUy8RJgDuM2uwChcbs25wN+bHwMSvD5ydo93p7Dj5A8kyPUjY2VBy08JvARLcrUg3uFdwoyg4UsbKj5NExYAS0L9NFN/Apb+xRzFt8OipUohPi7nsP8NmQxzosVGKllMENO4A53vqVVcky0Dro57hYHQzCh8XqrVB5JPTWJWF4BQDERj43l/kA9p97YMFfvQoAbtI1gA6d7Q1w0xny1RAYTKw0CQFuOrS6lIJ+8Nzw7QMPf8ig43PDxwXH990wPnNg+e8Jl3l184SXK/yAgVf7gAHOjut9QYH6vV9QoPT82z/lIvd8N9DU1NTU1NTU1NTU1PSw/gCN4F7HbUbz7gAAAABJRU5ErkJggg==
// @match        https://ezmp4.com/*
// @match        https://ezconv.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551675/EzConvcom%20Youtube%20to%20MP3%20Link%20Injector%20and%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/551675/EzConvcom%20Youtube%20to%20MP3%20Link%20Injector%20and%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // If we are on ezmp4.com, extract the URL and redirect
    if (window.location.hostname === 'ezmp4.com') {
        const urlParams = new URLSearchParams(window.location.search);
        const videoUrl = urlParams.get('q');
        if (videoUrl) {
            GM_setValue('ezconv_video_url', videoUrl);
            window.location.href = 'https://ezconv.com/';
        }
    }
    // If we are on ezconv.com, paste the URL and click Convert, then wait for Download MP3
    else if (window.location.hostname === 'ezconv.com') {
        const videoUrl = GM_getValue('ezconv_video_url');
        if (videoUrl) {
            const maxAttempts = 20;
            let attempts = 0;
            const checkInterval = setInterval(() => {
                attempts++;
                const inputField = document.querySelector(
                    'input[placeholder="Please paste the YouTube video URL here"][name="url"]'
                );
                if (inputField) {
                    inputField.focus();
                    document.execCommand('insertText', false, videoUrl);
                    const inputEvent = new Event('input', { bubbles: true });
                    const changeEvent = new Event('change', { bubbles: true });
                    inputField.dispatchEvent(inputEvent);
                    inputField.dispatchEvent(changeEvent);
                    console.log('URL inserted:', inputField.value);

                // Flag to enable/disable automatic MP3 download
                const autoDownloadMP3 = true; // Set to false to disable automatic download & manually select MP3 audio quality
                if (autoDownloadMP3) {
                    // --- Automatically Convert Button Click (128kbps quality) ---
                    const convertButton = document.querySelector('#\\:R1ajalffata\\:');
                    if (convertButton) {
                        console.log('Convert button found, clicking...');
                        convertButton.click();

                        // --- Wait for Download MP3 button ---
                        const maxDownloadAttempts = 60; // 60 seconds max
                        let downloadAttempts = 0;
                        const downloadInterval = setInterval(() => {
                            downloadAttempts++;
                            const downloadButton = document.querySelector(
                                "body > div > main > div > div.MuiBox-root.css-4qgjo8 > div.MuiBox-root.css-1kp13v1 > div > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.MuiGrid-grid-md-4.css-j6tcf3 > button"
                            );
                            if (downloadButton && downloadButton.textContent.includes('MP3')) {
                                console.log('Download MP3 button found, clicking...');
                                downloadButton.click();
                                clearInterval(downloadInterval);
                            } else if (downloadAttempts >= maxDownloadAttempts) {
                                console.log('Download MP3 button not found after several attempts');
                                clearInterval(downloadInterval);
                            }
                        }, 1000);
                        // --- End of Download MP3 ---
                    } else {
                        console.log('Convert button not found');
                    }
                } else {
                console.log('Automatic MP3 download is disabled, please select quality manually');
                }
                    clearInterval(checkInterval);
                    GM_setValue('ezconv_video_url', '');
                } else if (attempts >= maxAttempts) {
                    console.log('Input field not found after several attempts');
                    clearInterval(checkInterval);
                }
            }, 1000);
        }
    }
})();