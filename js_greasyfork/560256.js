// ==UserScript==
// @name         TokyoMotion Downloader
// @namespace    https://github.com/TohoEnjoyer2000/TokyoMotion-crx
// @name:ja           TokyoMotion Downloader
// @description:ja    Fetch videos and photos from tokyomotion HD quality when available
// @version      1.0.3
// @description  Fetch videos and photos from tokyomotion HD quality when available
// @match        https://www.tokyomotion.net/video/*
// @match        https://www.osakamotion.net/video/*
// @grant        none
// @run-at       document-end
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/560256/TokyoMotion%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/560256/TokyoMotion%20Downloader.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function run() {
        const referer = window.location.href;
        const id = referer.split('/')[4] ?? 'video';
        const titleElem = document.getElementsByClassName(
            'hidden-xs big-title-truncate m-t-0'
        )[0];

        if (!titleElem) return;

        const title = titleElem.innerText.replace(/[\\/:*?"<>|]/g, '_');

        const sep = document.getElementsByClassName(
            'separator m-t-15 p-0'
        )[0];
        if (!sep) return;

        const video = document.getElementsByTagName('video')[0];
        if (!video) return;

        const sources = Array.from(video.childNodes)
            .filter(n => n.nodeName.toLowerCase() === 'source')
            .map(s => s.src);

        if (sources.length === 0) return;

        const srcSD = sources[0];
        const srcHD = sources[1];
        const src = srcHD ?? srcSD;

        const curl = `curl -e "${referer}" "${src}" -L -o "${title}.mp4"`;
        const aria = `aria2c --referer="${referer}" "${src}"`;

        const box = document.createElement('div');
        box.style =
            'background-color:#f2f2f2;color:#000;border-radius:0.5rem;border:1px solid #9c9c9c;padding:4px;margin-bottom:6px;';

        const pre = document.createElement('pre');
        pre.textContent = `${curl}\n\n${aria}`;
        pre.style = 'white-space:pre-wrap;border:0;background:#f2f2f2;';

        const btn = document.createElement('a');
        btn.textContent = 'Download';
        btn.href = src;
        btn.download = `${id}.mp4`;
        btn.target = '_blank';
        btn.className = 'btn btn-primary navbar-btn';
        btn.onclick = () => {
            window.open(src, 'download_window');
            return false;
        };

        box.appendChild(pre);
        sep.appendChild(box);
        sep.appendChild(btn);
    }

    window.addEventListener('load', run);
})();