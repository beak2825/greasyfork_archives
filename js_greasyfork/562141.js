// ==UserScript==
// @name         SampleFocus Downloader Hack
// @namespace    http://tampermonkey.net/
// @version      v1.0.0
// @description  Download samples from SampleFocus without needing a subscription.
// @author       You
// @match        https://samplefocus.com/samples/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=samplefocus.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562141/SampleFocus%20Downloader%20Hack.user.js
// @updateURL https://update.greasyfork.org/scripts/562141/SampleFocus%20Downloader%20Hack.meta.js
// ==/UserScript==

// This script lets you download the audio file from the preview so you don't need any credits.
// The main downside to this is that the result is an MP3 file rather than a WAV file.

const downloadForFree = async () => {
    const elem = document.createElement('a');

    const sampleUrl = JSON.parse(document.querySelector('[data-component-name="SampleHero"]').innerText).sample.sample_mp3_url;
    const resp = await fetch(sampleUrl);
    const blob = await resp.blob();

    elem.href = URL.createObjectURL(blob);

    elem.download = sampleUrl.split('/')[8].split('?')[0]; // download file name
    elem.click();
};

const freeDownloadBtn = document.createElement('button');
freeDownloadBtn.innerText = 'CLICK TO GET MP3 WITH NO CREDITS';
freeDownloadBtn.style = 'color: white; background-color: black; border: 1px solid white; border-radius: 50px; font-size: 15px; padding: 10px; cursor: pointer';
freeDownloadBtn.addEventListener('click', downloadForFree);
document.getElementsByClassName('MuiGrid-root MuiGrid-container MuiGrid-spacing-xs-2 css-1eikg3m')[0].append(freeDownloadBtn);
