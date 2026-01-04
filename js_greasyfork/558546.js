// ==UserScript==
// @name         Sankaku Channel post download buttons
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds buttons to download the high and low res versions of the post file.
// @author       BicHD
// @match        https://chan.sankakucomplex.com/*
// @match        https://iapi.sankakucomplex.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sankakucomplex.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558546/Sankaku%20Channel%20post%20download%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/558546/Sankaku%20Channel%20post%20download%20buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.querySelectorAll('[onclick^="Post.prepare_download"]').forEach(el => el.remove());
    document.querySelectorAll('.ul--identifier').forEach(el => {
        if (el.textContent == "Download:") {
            if (el.nextElementSibling.tagName == "BR") {
                el.nextElementSibling.remove()
            }
            el.remove()
        }
    });
    const styles = `
        #downloadProgress { -webkit-appearance: none; -moz-appearance: none; appearance: none; border: 1px solid #ccc; border-radius: 4px; height: 10px; background-color: #eee; width: 100%; }
        #downloadProgress::-webkit-progress-bar { background-color: #eee; border-radius: 4px; }
        #downloadProgress::-webkit-progress-value { background-color: #ff761c; border-radius: 4px; transition: width 0.1s linear; }
        #downloadProgress::-moz-progress-bar { background-color: #ff761c; border-radius: 4px; transition: width 0.1s linear; }
        .progress-bar-container { overflow: hidden; transition: opacity 1s ease-out, max-height 1s ease-out, height 1s ease-out, padding 1s ease-out; max-height: 200px; height: 50px; text-align: center; }
    `;
    document.head.insertAdjacentHTML('beforeend', `<style>${styles}</style>`);

    function prepare_download(event, URL, fileName) {
        event.preventDefault();

        const progressBarContainer = document.createElement('div');
        progressBarContainer.className = 'progress-bar-container';
        progressBarContainer.innerHTML = `<div>Downloading ${fileName}...</div><progress id="downloadProgress" value="0" max="100"></progress>`;

        const lastDownloadElement = Array.from(document.querySelectorAll('#downloadResized,#downloadOriginal')).pop() ;
        if (lastDownloadElement) {
            lastDownloadElement.insertAdjacentElement('afterend', progressBarContainer);
        }

        const progressElement = document.getElementById('downloadProgress');
        fetch(URL, { headers: new Headers({ Origin: location.origin }), mode: "cors" })
            .then((response) => {
            if (!response.ok || !response.body) throw new Error(`Error: ${response.status}`);
            const reader = response.body.getReader(), chunks = [];
            let received = 0, total = parseInt(response.headers.get('Content-Length'), 10);

            function push() {
                reader.read().then(({ done, value }) => {
                    if (done) {
                        const blobURL = window.URL.createObjectURL(new Blob(chunks));
                        download(blobURL, fileName);
                        setTimeout(() => {
                            progressBarContainer.style.opacity = "0";
                            progressBarContainer.style.maxHeight = "0";
                            progressBarContainer.style.padding = "0";
                            progressBarContainer.style.opacity = "0";
                            setTimeout(() => progressBarContainer.remove(), 1000); }, 2000);
                    } else {
                        chunks.push(value);
                        received += value.length;
                        if (total) progressElement.value = (received / total) * 100;
                        push();
                    }
                }).catch(() => progressBarContainer.remove());
            }
            push();
        })
            .catch(() => progressBarContainer.remove());
    }

    function download(blobURL, fileName) {
        const a = document.createElement('a');
        a.href = blobURL;
        a.download = fileName;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => { document.body.removeChild(a); window.URL.revokeObjectURL(blobURL); }, 100);
    }

    const lowresEl = document.querySelector('#lowres');
    const highresEl = document.querySelector('#highres');
    const downloadLinks = [];

    if (lowresEl) {
        downloadLinks.push(`<a href="#" id="downloadResized">Resized</a>`);
    }
    if (highresEl) {
        downloadLinks.push(`<a href="#" id="downloadOriginal">Original</a>`);
    }

    if (downloadLinks.length) {
        highresEl?.insertAdjacentHTML('afterend', `<br><span class="ul--identifier">Download:</span> ${downloadLinks.join(' | ')}`);
        if (lowresEl) document.getElementById('downloadResized')?.addEventListener('click', (e) => prepare_download(e, lowresEl.href, `sample-${new URL(lowresEl.href).pathname.split('/').pop()}`));
        if (highresEl) document.getElementById('downloadOriginal')?.addEventListener('click', (e) => prepare_download(e, highresEl.href, new URL(highresEl.href).pathname.split('/').pop()));
    }
    if (Array.from(document.querySelectorAll('#downloadResized,#downloadOriginal')).pop().nextElementSibling?.tagName !== "BR") { Array.from(document.querySelectorAll('#downloadResized,#downloadOriginal')).pop().insertAdjacentHTML('afterend', '<br>'); }
})();