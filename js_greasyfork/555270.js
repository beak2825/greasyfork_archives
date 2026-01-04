// ==UserScript==
// @name         TakecomicDownloader
// @namespace    https://github.com/Timesient/manga-download-scripts
// @version      0.1
// @license      GPL-3.0
// @author       Timesient
// @description  Manga downloader for takecomic.jp
// @icon         https://www.google.com/s2/favicons?sz=64&domain=takecomic.jp
// @homepageURL  https://greasyfork.org/scripts/555270-takecomicdownloader
// @supportURL   https://github.com/Timesient/manga-download-scripts/issues
// @match        https://takecomic.jp/*
// @require      https://unpkg.com/axios@0.27.2/dist/axios.min.js
// @require      https://unpkg.com/jszip@3.7.1/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://update.greasyfork.org/scripts/451810/1398192/ImageDownloaderLib.js
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/555270/TakecomicDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/555270/TakecomicDownloader.meta.js
// ==/UserScript==

(async function(axios, JSZip, saveAs, ImageDownloader) {
  'use strict';

  // reload page when enter or leave chapter
  const re = /https:\/\/takecomic\.jp\/episodes\/.*/;
  const oldHref = window.location.href;
  const timer = setInterval(() => {
    const newHref = window.location.href;
    if (newHref === oldHref) return;
    if (re.test(newHref) || re.test(oldHref)) {
      clearInterval(timer);
      window.location.reload();
    }
  }, 200);

  // return if not reading chapter now
  if (!re.test(oldHref)) return;

  // get episode id and title
  const { id, title } = await new Promise(resolve => {
    const timer = setInterval(() => {
      const viewerElement = document.getElementById('comici-viewer');
      const titleElement = document.querySelector('.ep-main > .ep-main-h > .ep-main-h-main > h1.ep-main-h-h');
      if (viewerElement && titleElement) {
        clearInterval(timer);
        resolve({
          id: viewerElement.dataset.comiciViewerId,
          title: titleElement.textContent.trim()
        });
      }
    }, 500);
  });

  // get data of pages
  const userId = document.getElementById('xAnalyticLoggerUid')?.textContent || '0';
  const pageCount = await axios.get(`https://takecomic.jp/api/book/contentsInfo?user-id=${userId}&comici-viewer-id=${id}&page-from=0&page-to=0`).then(res => res.data.totalPages);
  const pages = await axios.get(`https://takecomic.jp/api/book/contentsInfo?user-id=${userId}&comici-viewer-id=${id}&page-from=0&page-to=${pageCount}`).then(res => res.data.result);

  // setup ImageDownloader
  ImageDownloader.init({
    maxImageAmount: pageCount,
    getImagePromises,
    title
  });

  // collect promises of image
  function getImagePromises(startNum, endNum) {
    return pages
      .slice(startNum - 1, endNum)
      .map(page => getDecryptedImage(page)
        .then(ImageDownloader.fulfillHandler)
        .catch(ImageDownloader.rejectHandler)
      );
  }

  // get promise of decrypted image
  function getDecryptedImage(data) {
    return new Promise(resolve => {
      const image = document.createElement('img');
      image.crossOrigin = 'anonymous';
      image.src = data.imageUrl;
      image.onload = function () {
        // create canvas
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = this.width;
        canvas.height = this.height;
        context.drawImage(this, 0, 0);

        // get scramble dict
        const dict = [];
        const dictTemplete = JSON.parse('[[0,0],[0,1],[0,2],[0,3],[1,0],[1,1],[1,2],[1,3],[2,0],[2,1],[2,2],[2,3],[3,0],[3,1],[3,2],[3,3]]');
        const scrambleOrders = JSON.parse(data.scramble);
        for (let i = 0; i < dictTemplete.length; i++) {
          dict.push(dictTemplete[scrambleOrders[i]]);
        }

        // start unscrambling
        const pieceWidth = Math.floor(data.width / 4);
        const pieceHeight = Math.floor(data.height / 4);
        let dictCounter = 0;
        for (let i = 0; i < 4; i++) {
          for (let j = 0; j < 4; j++) {
            const x = dict[dictCounter][0];
            const y = dict[dictCounter][1];
            context.drawImage(this, pieceWidth * x, pieceHeight * y, pieceWidth, pieceHeight, pieceWidth * i, pieceHeight * j, pieceWidth, pieceHeight);
            dictCounter++;
          }
        }

        // output unscrambled image
        canvas.toBlob(resolve, 'image/jpeg', 1);
      }
    });
  }

})(axios, JSZip, saveAs, ImageDownloader);