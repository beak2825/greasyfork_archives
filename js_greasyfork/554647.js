// ==UserScript==
// @name        NewtokiRipper
// @namespace   pixelcode
// @author      pixelcode
// @match       https://newtoki*.com/webtoon/*
// @version     2.4
// @description Download chapter dari Newtoki. Bisa download satu, rentang, atau semua chapter.
// @icon        https://cdn.discordapp.com/avatars/1402185096085241886/e3c26cdc99bfae067acc2b784d4efc2a.webp?size=64
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/shortcut@1
// @require     https://unpkg.com/@zip.js/zip.js@2.7.60/dist/zip-full.min.js
// @grant       GM_registerMenuCommand
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/554647/NewtokiRipper.user.js
// @updateURL https://update.greasyfork.org/scripts/554647/NewtokiRipper.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const fetchImage = async (url) => {
        const blob = await fetch(url, {
            headers: {
                accept: "image/avif,image/webp,image/apng/svg+xml,image/*,*/*;q=0.8",
                "accept-language": "en-US,en;q=0.9"
            },
            referrerPolicy: "strict-origin-when-cross-origin",
            mode: "cors",
        }).then((response) => {
            if (!response.ok) throw new Error(`Gagal: ${response.status}`);
            return response.blob();
        });
        return blob;
    };

    async function asyncPool(poolLimit, array, iteratorFn) {
        const ret = [], executing = [];
        for (const [index, item] of array.entries()) {
            const p = Promise.resolve().then(() => iteratorFn(item, index));
            ret.push(p);
            const e = p.then(() => executing.splice(executing.indexOf(e), 1));
            executing.push(e);
            if (executing.length >= poolLimit) await Promise.race(executing);
        }
        return Promise.all(ret);
    }


    const downloadSingleChapter = async (chapterElement, button, progressBar) => {
        button.disabled = true;
        button.textContent = '...';
        progressBar.style.display = 'inline-block';
        const progressInner = progressBar.querySelector('.ntr-progress-inner');

        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        document.body.appendChild(iframe);

        const waitIframeLoad = (url) => {
            return new Promise((resolve, reject) => {
                iframe.onload = () => resolve(iframe.contentDocument);
                iframe.onerror = () => reject(new Error("Gagal memuat iframe."));
                iframe.src = url;
            });
        };

        const updateProgress = (text, color = '#0077B6', percentage = null) => {
            progressInner.textContent = text;
            progressInner.style.backgroundColor = color;
            progressInner.style.width = percentage !== null ? `${percentage}%` : '100%';
        };

        try {
            updateProgress('Memuat...', '#0077B6');

            const chapterUrl = chapterElement.querySelector('a').href;
            const chapterNum = chapterElement.querySelector('.wr-num').innerText.padStart(4, '0');
            const rawTitle = chapterElement.querySelector('a').innerText.replace(/[\n\r]+|[\s]{2,}/g, ' ').trim();
            const cleanTitle = rawTitle.replace(/\s\d{1,3}$/, '').trim();
            const finalName = `[${chapterNum}] ${cleanTitle}`.replace(/[<>:"/\\|?*]/g, '_');
            const folderName = finalName;
            const zipFileName = `${finalName}.zip`;

            const iframeDoc = await waitIframeLoad(chapterUrl);
            await new Promise(resolve => setTimeout(resolve, 300));

            const images = [...iframeDoc.getElementsByTagName("img")].flatMap((img) => {
                const attributes = [...img.attributes].filter((attr) => /^data-[a-zA-Z0-9]{1,20}/.test(attr.name));
                const actualSrc = attributes[0]?.value;
                if (actualSrc?.startsWith("https://img")) return actualSrc;
                return [];
            });

            if (images.length === 0) throw new Error("Gambar tidak ditemukan");

            const zipWriter = new zip.ZipWriter(new zip.BlobWriter("application/zip"), { bufferedWrite: true });
            let completed = 0;

            await asyncPool(16, images, async (imageUrl, imageIndex) => {
                const imageData = await fetchImage(imageUrl);
                const imageName = `${(imageIndex + 1).toString().padStart(3, '0')}.jpg`;
                await zipWriter.add(`${folderName}/${imageName}`, new zip.BlobReader(imageData));
                completed++;
                const percentage = (completed / images.length) * 100;
                updateProgress(`${completed}/${images.length}`, '#0077B6', percentage);
            });

            updateProgress('Zipping...', '#00b4d8');
            const blobURL = URL.createObjectURL(await zipWriter.close());
            const link = document.createElement("a");
            link.href = blobURL;
            link.download = zipFileName;
            link.click();
            URL.revokeObjectURL(link.href);

            updateProgress('Selesai!', '#2a9d8f');

        } catch (err) {
            console.error("Gagal mengunduh chapter:", err);
            updateProgress(`Error: ${err.message}`, '#e63946');
        } finally {
            iframe.remove();
            setTimeout(() => {
                button.disabled = false;
                button.textContent = 'Download';
                progressBar.style.display = 'none';
                updateProgress('', '#0077B6', 0);
            }, 5000);
        }
    };


    const injectUI = () => {
        if (!document.querySelector('.list-body')) return;
        const style = document.createElement('style');
        style.textContent = `
            .list-body li { display: flex; justify-content: space-between; align-items: center; }
            .ntr-controls { display: flex; align-items: center; gap: 8px; margin-left: 10px; flex-shrink: 0; }
            .ntr-download-btn { background-color: #023e8a; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 12px; }
            .ntr-download-btn:disabled { background-color: #6c757d; cursor: not-allowed; }
            .ntr-progress-bar { display: none; width: 150px; height: 24px; background-color: #dee2e6; border-radius: 4px; overflow: hidden; }
            .ntr-progress-inner { height: 100%; width: 0%; background-color: #0077B6; color: white; font-size: 12px; display: flex; align-items: center; justify-content: center; transition: width 0.2s ease, background-color 0.2s ease; white-space: nowrap; }
        `;
        document.head.appendChild(style);
        document.querySelectorAll('.list-body li').forEach(li => {
            if (li.querySelector('.ntr-controls')) return;
            const controlsContainer = document.createElement('div');
            controlsContainer.className = 'ntr-controls';
            const button = document.createElement('button');
            button.textContent = 'Download';
            button.className = 'ntr-download-btn';
            const progressBar = document.createElement('div');
            progressBar.className = 'ntr-progress-bar';
            progressBar.innerHTML = `<div class="ntr-progress-inner"></div>`;
            controlsContainer.append(button, progressBar);
            li.appendChild(controlsContainer);
            button.addEventListener('click', (e) => {
                e.preventDefault();
                downloadSingleChapter(li, button, progressBar);
            });
        });
    };

    const startDownloadProcess = async (startIndex = null, lastIndex = null) => {
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
        const waitIframeLoad = (url) => new Promise((resolve, reject) => {
            iframe.onload = () => resolve(iframe.contentDocument);
            iframe.onerror = () => reject(new Error("Gagal memuat iframe."));
            iframe.src = url;
        });

        if (!document.querySelector('.list-body')) {
            alert('Skrip ini hanya bisa dijalankan dari halaman daftar chapter webtoon.');
            return;
        }
        const progressBarModal = document.createElement("div");
        progressBarModal.id = "dl-progress-modal";
        progressBarModal.style.cssText = `
            padding: 20px; background-color: rgba(0, 0, 0, 0.95); border-radius: 10px; border: 2px solid #0077B6;
            box-shadow: 0 0 20px rgba(0, 119, 182, 0.7); position: fixed; left: 50%; top: 50%;
            transform: translate(-50%, -50%); z-index: 999999; font-size: 20px; color: white; min-width: 400px;
            text-align: center; backdrop-filter: blur(8px); font-family: Arial, sans-serif; font-weight: bold;
        `;
        document.body.appendChild(progressBarModal);

        try {
            progressBarModal.textContent = "Mempersiapkan daftar chapter...";
            let chapterList = Array.from(document.querySelector('.list-body').querySelectorAll('li')).reverse();
            if (startIndex) chapterList = chapterList.filter(li => parseInt(li.querySelector('.wr-num').innerText) >= startIndex);
            if (lastIndex) chapterList = chapterList.filter(li => parseInt(li.querySelector('.wr-num').innerText) <= lastIndex);

            if (chapterList.length === 0) throw new Error("Chapter tidak ditemukan");

            const seriesTitle = document.querySelector('.page-title .page-desc')?.innerText.trim() || document.title;
            const startNum = chapterList[0].querySelector('.wr-num').innerText;
            const endNum = chapterList[chapterList.length - 1].querySelector('.wr-num').innerText;
            const zipFileName = `${seriesTitle} (${startNum}-${endNum}).zip`.replace(/[<>:"/\\|?*]/g, '_');

            const zipWriter = new zip.ZipWriter(new zip.BlobWriter("application/zip"), { bufferedWrite: true });

            for (const [chapterIndex, chapterElement] of chapterList.entries()) {
                const chapterNum = chapterElement.querySelector('.wr-num').innerText.padStart(4, '0');
                const rawTitle = chapterElement.querySelector('a').innerText.replace(/[\n\r]+|[\s]{2,}/g, ' ').trim();
                const cleanTitle = rawTitle.replace(/\s\d{1,3}$/, '').trim();
                const folderName = `[${chapterNum}] ${cleanTitle}`.replace(/[<>:"/\\|?*]/g, '_');

                progressBarModal.textContent = `(${chapterIndex + 1}/${chapterList.length}) Memuat: ${cleanTitle}...`;
                const iframeDoc = await waitIframeLoad(chapterElement.querySelector('a').href);
                await new Promise(resolve => setTimeout(resolve, 300));

                const images = [...iframeDoc.getElementsByTagName("img")].flatMap((img) => {
                    const attributes = [...img.attributes].filter((attr) => /^data-[a-zA-Z0-9]{1,20}/.test(attr.name));
                    const actualSrc = attributes[0]?.value;
                    if (actualSrc?.startsWith("https://img")) return actualSrc;
                    return [];
                });

                if (images.length === 0) continue;

                let completedInChapter = 0;
                await asyncPool(16, images, async (imageUrl, imageIndex) => {
                    const imageData = await fetchImage(imageUrl);
                    const imageName = `${(imageIndex + 1).toString().padStart(3, '0')}.jpg`;
                    await zipWriter.add(`${folderName}/${imageName}`, new zip.BlobReader(imageData));
                    completedInChapter++;
                    progressBarModal.innerHTML = `Chapter ${chapterIndex + 1}/${chapterList.length}: ${cleanTitle}<br>
                                                  <span style="color:#00ffff; font-size: 18px;">Mengunduh: ${completedInChapter}/${images.length}</span>`;
                });
            }

            progressBarModal.textContent = "Mengemas file ZIP...";
            const blobURL = URL.createObjectURL(await zipWriter.close());
            const link = document.createElement("a");
            link.href = blobURL;
            link.download = zipFileName;
            link.click();
            URL.revokeObjectURL(link.href);
            progressBarModal.textContent = `Selesai! ${chapterList.length} chapter diunduh.`;
            progressBarModal.style.borderColor = "#00ff00";

        } catch (err) {
            progressBarModal.innerHTML = `<span style="color:red">ERROR: ${err.message}</span>`;
            progressBarModal.style.borderColor = "red";
            console.error("Terjadi kesalahan fatal:", err);
        } finally {
            iframe.remove();
            setTimeout(() => progressBarModal.remove(), 5000);
        }
    };


    injectUI();
    GM_registerMenuCommand('Download Semua Chapter', () => startDownloadProcess());
    GM_registerMenuCommand('Download Chapter No...', () => {
        const chapterNumber = prompt('Masukkan nomor chapter yang ingin diunduh:', '1');
        if (chapterNumber) {
            const num = parseInt(chapterNumber, 10);
            startDownloadProcess(num, num);
        }
    });
    GM_registerMenuCommand('Download Mulai dari Chapter...', () => {
        const start = prompt('Mulai download dari chapter nomor berapa?', '1');
        if (start) startDownloadProcess(parseInt(start, 10), null);
    });
    GM_registerMenuCommand('Download Rentang Chapter...', () => {
        const start = prompt('Mulai download dari chapter nomor berapa?', '1');
        if (!start) return;
        const end = prompt('Download sampai chapter nomor berapa?');
        if (!end) return;
        startDownloadProcess(parseInt(start, 10), parseInt(end, 10));
    });

})();

