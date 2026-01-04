// ==UserScript==
// @name         TakeComiDownloader
// @namespace    https://github.com/Timesient/manga-download-scripts
// @version      0.1
// @license      GPL-3.0
// @author       lasthm
// @description  Manga downloader specific for Comici Viewer
// @icon         https://www.google.com/s2/favicons?sz=64&domain=takecomic.jp
// @match        https://takecomic.jp/episodes/*
// @require      https://unpkg.com/axios@0.27.2/dist/axios.min.js
// @require      https://unpkg.com/jszip@3.7.1/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://update.greasyfork.org/scripts/539610/1639733/ImageDownloaderLibla2.js
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/552869/TakeComiDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/552869/TakeComiDownloader.meta.js
// ==/UserScript==

(async function(axios, JSZip, saveAs, ImageDownloader) {
  'use strict';

  // get episode id and domain
  const { id, userId } = await new Promise(resolve => {
    const timer = setInterval(() => {
      const viewerElement = document.getElementById('comici-viewer');
      if (viewerElement) {
        clearInterval(timer);
        resolve({
          id: viewerElement.getAttribute('data-comici-viewer-id'),
          userId: viewerElement.getAttribute('data-member-jwt')
        });
      }
    }, 500);
  });

  // get title and amount of pages
  const title1 = document.querySelector('h1.series-h-title').innerText;
  const title2 = document.querySelector('h1.ep-main-h-h').textContent;
  const { pageCount } = await axios({
    method: 'GET',
    url: `https://takecomic.jp/api/book/contentsInfo?user-id=${userId}&comici-viewer-id=${id}&page-from=0&page-to=1`
  }).then(res => {
    return {
      pageCount: res.data.totalPages
    }
  });
  const newtitle = `${title1} ${title2}`;
  let title = newtitle.replace(/(\?|\~|\/|\:)/gi,  function ($0, $1) {
        return {
            '?':'？',
            '~':'～',
            '/':'／',
            ':':'：',
            }[$1];
            });

  // get data of pages
  const pages = await axios.get(`https://takecomic.jp/api/book/contentsInfo?user-id=${userId}&comici-viewer-id=${id}&page-from=0&page-to=${pageCount}`).then(res => res.data.result);

  // setup ImageDownloader
  ImageDownloader.init({
    maxImageAmount: pageCount,
    getImagePromises,
    title,
    imageSuffix: 'png'
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
        canvas.toBlob(resolve);
      }
    });
  }

})(axios, JSZip, saveAs, ImageDownloader);